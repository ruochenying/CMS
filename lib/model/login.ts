import { Role } from "./Role";
export interface LoginRequest {
  role: Role;
  email: string;
  password: string;
}

export interface LoginFormValue extends LoginRequest {
  remember: boolean;
}

export interface LoginResponse {
  role: Role;
  token: string;
  userId: number;
}
