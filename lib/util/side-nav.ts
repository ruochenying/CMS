import { useRouter } from "next/router";
import { memoize } from "lodash";
import { SideNav } from "../constant/routes";
import { Role } from "../model";
import storage from "../services/storage";
import { useUserRole } from "../../components/custom-hooks/Login-state";

export const generateKey = (data: SideNav, index: number): string => {
  return `${data.label}_${index}`;
};

const isDetailPath = (path: string): boolean => {
  const paths = path.split("/");
  const length = paths.length;
  const last = paths[length - 1];
  const reg = /\[.*\]/;

  return reg.test(last);
};

const omitDetailPath = (path: string): string => {
  const isDetail = isDetailPath(path);

  return isDetail ? path.slice(0, path.lastIndexOf("/")) : path;
};

const generatePath = (data: SideNav): string => {
  return data.path.join("/");
};

const generateFactory = (fn: (data: SideNav, index: number) => string) =>
  function inner(data: SideNav[], current = ""): string[][] {
    const keys = data.map((item, index) => {
      let key = fn(item, index);

      if (current) {
        key = [current, key].join("/");
      }

      if (item.subNav && !!item.subNav.length) {
        return inner(item.subNav, key).map((item) => item.join("/"));
      } else {
        return [key];
      }
    });

    return keys;
  };

const getKeyPathInfo = (
  data: SideNav[],
  role: Role
): { keys: string[]; paths: any[] } => {
  const getPaths = generateFactory(generatePath);
  const paths = getPaths(data)
    .reduce((acc, cur) => [...acc, ...cur], [])
    .map((item) =>
      ["/dashboard", role, item].filter((item) => !!item).join("/")
    );
  const getKeys = generateFactory(generateKey);
  const keys = getKeys(data).reduce((acc, cur) => [...acc, ...cur], []);

  return { keys, paths };
};

const memoizedGetKeyPathInfo = memoize(getKeyPathInfo, (data) => {
  data.map((item) => item.label).join("_");
});

const isPathEqual = (target: string) => (current: string) => {
  current = current.endsWith("/") ? current.slice(0, -1) : current;

  return current === target;
};

export const getSideNavNameByKey = (key: string): string[] => {
  return key.split("/").map((item) => item.split("_")[0]);
};

export const getActiveKey = (data: SideNav[], pathname: string, role: Role) => {
  const activeRoute = omitDetailPath(pathname);
  const { paths, keys } = memoizedGetKeyPathInfo(data, role);
  const isEqual = isPathEqual(activeRoute);
  const index = paths.findIndex(isEqual);

  return keys[index] || "";
};

export const getSideNavNameByPath = (
  data: SideNav[],
  path: string,
  role: Role
): string[] => {
  const isDetail = isDetailPath(path);
  path = isDetail ? path.split("/").slice(0, -1).join("/") : path;
  const { paths, keys } = memoizedGetKeyPathInfo(data, role);
  const isEqual = isPathEqual(path);
  const index = paths.findIndex(isEqual);

  const result = getSideNavNameByKey(keys[index]);

  return isDetail ? [...result, "Detail"] : result;
};
