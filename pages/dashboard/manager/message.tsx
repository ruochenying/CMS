import { useEffect, useState } from "react";
import { Avatar, Col, List, Row, Select, Space, Spin, Typography } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  AlertOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";

import DashBoardLayout from "../../../components/DashboardLayout";
import { Message, MessageType, Paginator } from "../../../lib/model";
import { getMessages, markAsRead } from "../../../lib/services/api-service";
import storage from "../../../lib/services/storage";
import { useMsgStatistic } from "../../../components/MessagesProvider";

const Page = () => {
  const [type, setType] = useState<MessageType>(null);
  const [messageList, setMessageList] = useState([]);
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
      if (!resp.messages) return;
      setTotal(resp.total);

      const result = {};

      resp.messages.map((item) => {
        if (!result[item.createdAt.split(" ")[0]]) {
          result[item.createdAt.split(" ")[0]] = [item];
        } else {
          result[item.createdAt.split(" ")[0]].push(item);
        }
      });
      const target = Object.entries(result);

      setMessageList((pre) => {
        return [...pre, ...target];
      });
    });
  }, [pagination, type]);

  return (
    <DashBoardLayout>
      <Row align="middle">
        <Col span={8}>
          <Typography.Title level={2}>Recent Messages</Typography.Title>
        </Col>

        <Col span={8} offset={8} style={{ textAlign: "right" }}>
          <Select
            defaultValue={null}
            onSelect={(value) => {
              setType(value);
              setPagination({ ...pagination, page: 1 });
            }}
            style={{ minWidth: 100 }}
          >
            <Select.Option value={null}>All</Select.Option>
            <Select.Option value="notification">Notification</Select.Option>
            <Select.Option value="message">Message</Select.Option>
          </Select>
        </Col>
      </Row>
      <div
        id="msg-container"
        style={{ padding: "0 20px", overflowY: "scroll", maxHeight: "75vh" }}
      >
        <InfiniteScroll
          next={() => {
            setPagination({ ...pagination, page: pagination.page + 1 });
            setHasMore(
              messageList
                .flat()
                .filter((item) => typeof item !== "string")
                .flat().length < total
            );
          }}
          hasMore={hasMore}
          loader={
            <div style={{ textAlign: "center" }}>
              <Spin />
            </div>
          }
          dataLength={Object.values(messageList).length}
          endMessage={<div style={{ textAlign: "center" }}>No more</div>}
          scrollableTarget="msg-container"
        >
          <List
            itemLayout="vertical"
            dataSource={messageList}
            renderItem={([date, value]: [string, Message[]]) => (
              <>
                <Space size="large">
                  <Typography.Title level={4}>{date}</Typography.Title>
                </Space>

                {value.map((item) => (
                  <List.Item
                    key={item.createdAt}
                    style={{ opacity: item.status ? 0.4 : 1 }}
                    actions={[
                      <Space key={item.createdAt}>{item.createdAt}</Space>,
                    ]}
                    extra={
                      <Space>
                        {item.type === "notification" ? (
                          <AlertOutlined />
                        ) : (
                          <MessageOutlined />
                        )}
                      </Space>
                    }
                    onClick={() => {
                      if (item.status === 1) {
                        return;
                      }
                      markAsRead([item.id]).then((resp) => {
                        if (resp) {
                          messageList.forEach(([_, values]) => {
                            const result = values.find(
                              (value) => value.id === item.id
                            );
                            if (result) {
                              result.status = 1;
                            }
                          });
                          setMessageList([...messageList]);
                          dispatch({
                            type: "decrement",
                            payload: { count: 1, type: item.type },
                          });
                        }
                      });
                    }}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={item.from.nickname}
                      description={item.content}
                    />
                  </List.Item>
                ))}
              </>
            )}
          />
        </InfiniteScroll>
      </div>
    </DashBoardLayout>
  );
};

export default Page;
