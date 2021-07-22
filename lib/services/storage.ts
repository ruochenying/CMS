// import { LoginResponse, Role } from "../model";

// export type UserInfo = LoginResponse;

// const key = "user";

// export const setUserInfo = (userInfo: UserInfo) => {
//   localStorage.setItem(key, JSON.stringify(userInfo));
// };

// export const getUserInfo = (): UserInfo => {
//   return JSON.parse(localStorage.getItem(key))  as UserInfo;
// };

// export const removeUserInfo = (): void => {
//   localStorage.removeItem(key);
// };

import { LoginResponse, Role } from "../model";

export type UserInfo = LoginResponse;

export class Storage {
  private key = "cms";

  setUserInfo(info: UserInfo): void {
    localStorage.setItem(this.key, JSON.stringify(info));
  }

  get userInfo(): UserInfo {
    try {
      return JSON.parse(localStorage.getItem(this.key)) as UserInfo;
    } catch (error) {
      return null;
    }
  }

  get token(): string | null {
    return this.userInfo?.token;
  }

  get role(): Role {
    return this.userInfo?.role;
  }

  get userId(): number {
    return +this.userInfo?.userId;
  }

  deleteUserInfo(): void {
    localStorage.removeItem(this.key);
  }
}
export const storage = new Storage();

export default storage;
