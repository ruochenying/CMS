import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { routes, SideNav } from "../lib/constant/routes";
import { generateKey, getActiveKey } from "../lib/util/side-nav";

import { logout } from "../lib/services/api-service";
import Link from "next/link";

import SubMenu from "antd/lib/menu/SubMenu";
import NavBreadcrumb from "./NavBreadcrumb";
import { Role } from "../lib/model";
import { useUserRole } from "./custom-hooks/Login-state";
import storage from "../lib/services/storage";

const { Header, Sider, Content } = Layout;

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
          <NavBreadcrumb />
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
