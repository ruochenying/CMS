import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import storage from "../lib/services/storage";
import { logout } from "../lib/services/api-service";

const { Header, Sider, Content } = Layout;

const DashboardLayout = (props: React.PropsWithChildren<any>) => {
  const { children } = props;
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const DropdownAvatar = () => {
    return (
      <Dropdown overlay={menu} placement="bottomLeft">
        <Avatar style={{ marginRight: 20 }} icon={<UserOutlined />} />
      </Dropdown>
    );
  };
  const logoutHandler = async () => {
    logout();
    storage.deleteUserInfo();
    router.push("/login");
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={logoutHandler} icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            nav 1
          </Menu.Item>
          <Menu.Item key="2" icon={<VideoCameraOutlined />}>
            nav 2
          </Menu.Item>
          <Menu.Item key="3" icon={<UploadOutlined />}>
            nav 3
          </Menu.Item>
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
          <DropdownAvatar />
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
