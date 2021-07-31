import { Breadcrumb } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { routes, SideNav } from "../lib/constant/routes";
import { Role } from "../lib/model";
import storage from "../lib/services/storage";
import { getSideNavNameByPath } from "../lib/util";
import { deepSearchRecordFactory } from "../lib/util/deep-search";
import { useUserRole } from "./custom-hooks/Login-state";

const NavBreadcrumb = () => {
  const router = useRouter();
  const path = router.pathname;
  const paths = path.split("/").slice(1);
  const root = "/" + paths.slice(0, 2).join("/");
  const role = useUserRole();
  const sideNav = routes.get(role);

  const names = getSideNavNameByPath(sideNav, path, role) || [];

  return (
    <Breadcrumb style={{ marginLeft: 10, marginBottom: 20 }}>
      <Breadcrumb.Item key={root}>
        <Link href={root}>{`CMS ${role.toLocaleUpperCase()} SYSTEM`}</Link>
      </Breadcrumb.Item>
      {names.map((name, index) => {
        if (name === "Detail") {
          return <Breadcrumb.Item key={index}>Detail</Breadcrumb.Item>;
        }

        const record = deepSearchRecordFactory(
          (nav: SideNav, value: string) => nav.label === value,
          name,
          "subNav"
        )(sideNav);
        const { navs }: { source: SideNav[]; navs: SideNav[] } = record.reduce(
          (acc, cur) => {
            const item = acc.source[acc.source.length + cur];

            return { source: item.subNav, navs: [...acc.navs, item] };
          },
          { source: sideNav, navs: [] }
        );
        const isText =
          index === names.length - 1 ||
          navs.every((item) => item.hideLinkInBreadcrumb);
        const subPath = navs
          .map((item) => item.path)
          .reduce((acc, cur) => [...acc, ...cur], [])
          .filter((item) => !!item)
          .join("/");

        return (
          <Breadcrumb.Item key={index}>
            {isText ? name : <Link href={`${root}/${subPath}`}>{name}</Link>}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default NavBreadcrumb;
