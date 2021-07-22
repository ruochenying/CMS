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
  DashboardOutlined,
  SolutionOutlined,
  DeploymentUnitOutlined,
  ReadOutlined,
  MessageOutlined,
  TeamOutlined,
  FileAddOutlined,
  ProjectOutlined,
  EditOutlined,
} from "@ant-design/icons";

import storage from "../lib/services/storage";
import { logout } from "../lib/services/api-service";
import Link from "next/link";
import SubMenu from "antd/lib/menu/SubMenu";

const { Header, Sider, Content } = Layout;

const DashboardLayout = (props: React.PropsWithChildren<any>) => {
  const { children } = props;
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const role = storage.role;

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
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
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
          <Link href="/">
            <span style={{ color: "#fff", cursor: "pointer" }}>CMS</span>
          </Link>
        </div>
        {role === "manager" && (
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<DashboardOutlined />}>
              Overview
            </Menu.Item>
            <SubMenu key="student" icon={<SolutionOutlined />} title="Student">
              <Menu.Item key="2" icon={<TeamOutlined />}>
                <Link href={`/dashboard/${role}/students`}> Student List</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="teacher"
              icon={<DeploymentUnitOutlined />}
              title="Teacher"
            >
              <Menu.Item key="3" icon={<TeamOutlined />}>
                <Link href={`/dashboard/${role}/teachers`}> Teacher List</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="course" icon={<ReadOutlined />} title="Course">
              <Menu.Item key="4" icon={<ProjectOutlined />}>
                All Courses
              </Menu.Item>
              <Menu.Item key="5" icon={<FileAddOutlined />}>
                Add Course
              </Menu.Item>
              <Menu.Item key="6" icon={<EditOutlined />}>
                Edit Course
              </Menu.Item>
            </SubMenu>

            <Menu.Item key="7" icon={<MessageOutlined />}>
              Message
            </Menu.Item>
          </Menu>
        )}
        {role === "student" && (
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              student 1
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              nav 2
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              nav 3
            </Menu.Item>
          </Menu>
        )}
        {role === "teacher" && (
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              teacher 1
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              nav 2
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              nav 3
            </Menu.Item>
          </Menu>
        )}
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
