import React, { useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/router";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Row,
  Col,
  Badge,
  Tabs,
  message,
  Spin,
  List,
  Space,
  Button,
  notification,
} from "antd";
import {
  BellOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

import { routes, SideNav } from "../lib/constant/routes";
import { generateKey, getActiveKey } from "../lib/util/side-nav";

import {
  getMessages,
  getMessageStatistic,
  logout,
  markAsRead,
  messageEvent,
} from "../lib/services/api-service";
import Link from "next/link";

import SubMenu from "antd/lib/menu/SubMenu";
import NavBreadcrumb from "./NavBreadcrumb";
import { Message, MessageType, Paginator, Role } from "../lib/model";
import { useUserRole } from "./custom-hooks/Login-state";
import storage from "../lib/services/storage";
import { useMsgStatistic } from "./MessagesProvider";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatDistanceToNow } from "date-fns";

const { Header, Sider, Content } = Layout;

const TabNavContainer = styled.div`
  margin-bottom: 0;
  padding: 10px 20px 0 20px;
  .ant-tabs-nav-list {
    width: 100%;
    justify-content: space-around;
  }
`;

const Footer = styled(Row)`
  height: 50px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 0 0 4px 4px;
  border: 1px solid #f0f0f0;
  border-left: none;
  border-right: none;
  background: #fff;
  z-index: 9;
  .ant-col {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:first-child {
      box-shadow: 1px 0 0 0 #f0f0f0;
    }
  }
  button {
    border: none;
  }
`;

const getMenuConfig = (
  data: SideNav[],
  pathname: string,
  role: Role
): { defaultSelectedKeys: string[]; defaultOpenKeys: string[] } => {
  const key = getActiveKey(data, pathname, role);
  const defaultSelectedKeys = [key.split("/").pop()];
  const defaultOpenKeys = key.split("/").slice(0, -1);

  return { defaultSelectedKeys, defaultOpenKeys };
};

const renderMenuItems = (
  data: SideNav[],
  role?: Role,
  parent = ""
): JSX.Element[] => {
  return data.map((item, index) => {
    const key = generateKey(item, index);
    if (item.hide) {
      return null;
    } else if (item.subNav) {
      return (
        <SubMenu key={key} title={item.label} icon={item.icon}>
          {renderMenuItems(item.subNav, role, item.path.join("/"))}
        </SubMenu>
      );
    } else {
      return (
        <Menu.Item key={key} title={item.label} icon={item.icon}>
          {!!item.path.length ||
          item.label.toLocaleLowerCase() === "overview" ? (
            <Link
              href={["/dashboard", role, parent, ...item.path]
                .filter((item) => !!item)
                .join("/")}
              replace
            >
              {item.label}
            </Link>
          ) : (
            item.label
          )}
        </Menu.Item>
      );
    }
  });
};

interface MessageProps {
  type: MessageType;
  NewMessage?: Message;
}

const Messages = ({ type, NewMessage }: MessageProps) => {
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [pagination, setPagination] = useState<Paginator>({
    page: 1,
    limit: 20,
  });

  const { dispatch } = useMsgStatistic();

  useEffect(() => {
    const req = {
      page: pagination.page,
      limit: pagination.limit,
      userId: storage.userId,
      type: type,
    };
    getMessages(req).then((resp) => {
      if (resp) {
        setTotal(resp.total);
        setMessageList((pre) => [...pre, ...resp.messages]);
      }
    });
  }, [pagination, type]);

  useEffect(() => {
    if (!!NewMessage && NewMessage.type === type) {
      setMessageList((pre) => [NewMessage, ...pre]);
    }
  }, [NewMessage, type]);

  return (
    <>
      <div
        id={`msg-container-${type}`}
        style={{ marginLeft: "20px", overflowY: "scroll", height: "380px" }}
      >
        <InfiniteScroll
          next={() => {
            setPagination({ ...pagination, page: pagination.page + 1 });
            setHasMore(messageList.length < total);
          }}
          hasMore={hasMore}
          loader={
            <div style={{ textAlign: "center" }}>
              <Spin />
            </div>
          }
          dataLength={messageList.length}
          endMessage={<div style={{ textAlign: "center" }}>No more</div>}
          scrollableTarget={`msg-container-${type}`}
        >
          <List
            itemLayout="vertical"
            dataSource={messageList}
            renderItem={(item, index) => (
              <List.Item
                key={index}
                style={{ opacity: item.status ? 0.4 : 1 }}
                actions={[
                  <Space key={index}>
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                    })}
                  </Space>,
                ]}
                onClick={() => {
                  if (item.status === 1) {
                    return;
                  }

                  markAsRead([item.id]).then((res) => {
                    if (res) {
                      const target = messageList.find(
                        (msg) => item.id === msg.id
                      );

                      target.status = 1;
                      setMessageList([...messageList]);
                    }

                    dispatch({
                      type: "decrement",
                      payload: { count: 1, type: item.type },
                    });
                  });
                }}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={item.from.nickname}
                  description={item.content}
                />
              </List.Item>
            )}
          ></List>
        </InfiniteScroll>
      </div>
      <Footer>
        <Col span={12}>
          <Button
            onClick={() => {
              const ids = messageList
                .filter((item) => item.status === 0)
                .map((item) => item.id);

              if (ids.length) {
                markAsRead(ids).then((res) => {
                  if (res) {
                    setMessageList(
                      messageList.map((item) => ({ ...item, status: 1 }))
                    );
                  }

                  dispatch({
                    type: "decrement",
                    payload: { count: ids.length, type },
                  });
                });
              } else {
                message.warn(`All of these ${type}s has been marked as read!`);
              }
            }}
          >
            Mark all as read
          </Button>
        </Col>

        <Col span={12}>
          <Button>
            <Link href={`/dashboard/${storage.role}/message`}>
              View history
            </Link>
          </Button>
        </Col>
      </Footer>
    </>
  );
};

const MessagePanel = () => {
  const types: MessageType[] = ["notification", "message"];
  const { msgStore, dispatch } = useMsgStatistic();
  const [activeType, setActiveType] = useState<MessageType>("notification");
  const [message, setMessage] = useState<Message>(null);

  useEffect(() => {
    getMessageStatistic().then((resp) => {
      if (!!resp) {
        const { notification, message } = resp.receive;

        dispatch({
          type: "increment",
          payload: { type: "message", count: message.unread },
        });
        dispatch({
          type: "increment",
          payload: { type: "notification", count: notification.unread },
        });
      }
    });

    const sse = new EventSource(
      `https://cms.chtoma.com/api/message/subscribe?userId=${storage.userId}`,
      {
        withCredentials: true,
      }
    );

    sse.onmessage = (event) => {
      let { data } = event;

      data = JSON.parse(data || {});

      if (data.type !== "heartbeat") {
        const content = data.content as Message;

        if (content.type === "message") {
          notification.info({
            message: `You have a message from ${content.from.nickname}`,
            description: content.content,
          });
        }

        setMessage(content);
        dispatch({
          type: "increment",
          payload: { type: content.type, count: 1 },
        });
      }
    };

    return () => {
      sse.close();
      dispatch({ type: "reset" });
    };
  }, [dispatch]);

  return (
    <Badge size="small" count={msgStore.total} offset={[10, 0]}>
      <Dropdown
        placement="bottomLeft"
        trigger={["click"]}
        overlayStyle={{
          background: "#fff",
          borderRadius: 4,
          width: 400,
          height: 500,
          overflow: "hidden",
        }}
        overlay={
          <>
            <Tabs
              animated
              onChange={(key: MessageType) => {
                if (key !== activeType) {
                  setActiveType(key);
                }
              }}
              renderTabBar={(props, DefaultTabBar) => {
                return (
                  <TabNavContainer>
                    <DefaultTabBar {...props} />
                  </TabNavContainer>
                );
              }}
            >
              {types.map((type) => {
                return (
                  <Tabs.TabPane tab={`${type} (${msgStore[type]})`} key={type}>
                    <Messages type={type} NewMessage={message} />
                  </Tabs.TabPane>
                );
              })}
            </Tabs>
          </>
        }
      >
        <BellOutlined style={{ fontSize: 24, color: "white" }} />
      </Dropdown>
    </Badge>
  );
};

const DashboardLayout = (props: React.PropsWithChildren<any>) => {
  const { children } = props;
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const role = useUserRole();
  const sideNav = routes.get(role);

  const { defaultOpenKeys, defaultSelectedKeys } = getMenuConfig(
    sideNav,
    router.pathname,
    role
  );

  const DropdownAvatar = () => {
    return (
      <Dropdown overlay={avatarMenu} placement="bottomLeft">
        <Avatar style={{ marginRight: 20 }} icon={<UserOutlined />} />
      </Dropdown>
    );
  };
  const logoutHandler = async () => {
    logout().then((resp) => {
      if (resp) storage.deleteUserInfo();
      router.push("/login");
    });
  };

  const avatarMenu = (
    <Menu>
      <Menu.Item key="100" onClick={logoutHandler} icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          top: 0,
          left: 0,
        }}
        onCollapse={(isCollapsed) => setCollapsed(isCollapsed)}
      >
        <div
          style={{
            height: "64px",
            display: "inline-flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "24px",
            color: "#fff",
            letterSpacing: "5px",
            textShadow: "5px 1px 5px",
            transform: "rotateX(45deg)",
            fontFamily: "monospace",
          }}
        >
          <Link href="/" passHref>
            <span style={{ color: "#fff", cursor: "pointer" }}>CMS</span>
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={defaultOpenKeys}
          defaultSelectedKeys={defaultSelectedKeys}
        >
          {renderMenuItems(sideNav, role)}
        </Menu>
      </Sider>

      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#001529",
            position: "sticky",
            zIndex: 10,
            top: 0,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => {
                setCollapsed(!collapsed);
              },
            }
          )}
          <Row gutter={[35, 16]} align="middle">
            <Col style={{ top: 5 }}>
              <MessagePanel />
            </Col>
            <Col>
              <DropdownAvatar />
            </Col>
          </Row>
        </Header>

        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "auto",
          }}
        >
          <NavBreadcrumb />
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
