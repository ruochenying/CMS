import { RootPath } from "./api-path";
import axios, { AxiosError } from "axios";
import { AES } from "crypto-js";
import {
  IResponse,
  LoginRequest,
  LoginResponse,
  StudentsRequest,
  StudentsResponse,
  AddStudentRequest,
  AddStudentResponse,
  UpdateStudentResponse,
  UpdateStudentRequest,
  StudentRequest,
  StudentResponse,
} from "../model";
import storage from "./storage";
import { message } from "antd";
import { Content } from "antd/lib/layout/layout";

const baseURL = "https://cms.chtoma.com/api/";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  responseType: "json",
});

// const token = storage.token;
// if (token) {
//   axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// }

axiosInstance.interceptors.request.use((config) => {
  if (!config.url.includes("login")) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: "Bearer " + storage?.token,
      },
    };
  }

  return config;
});

const errorHandler = (err: AxiosError<IResponse>) => {
  const msg = err.response.data.msg;
  const code = err.response.status;
  console.log(msg);
  console.log(code);
  if (isError(code)) message.error(msg);
  if (!isError(code)) message.success(msg);
};

const isError = (code: number): boolean => {
  return !(code.toString().startsWith("2") || code.toString().startsWith("3"));
};

export const logout = async () => {
  await axiosInstance
    .post<IResponse<Boolean>>(RootPath.logout, {})
    .catch((e) => errorHandler(e));
};

export const login = async ({ password, ...rest }: LoginRequest) => {
  try {
    const { data } = await axiosInstance.post<IResponse<LoginResponse>>(
      RootPath.login,
      {
        ...rest,
        password: AES.encrypt(password, "cms").toString(),
      }
    );
    return data.data;
  } catch (e) {
    errorHandler(e);
  }
};

export const getStudents = async (req?: StudentsRequest) => {
  try {
    const { data } = await axiosInstance.get<IResponse<StudentsResponse>>(
      RootPath.students,
      {
        params: req,
      }
    );
    return data.data;
  } catch (e) {
    errorHandler(e);
  }
};

export const addStudent = async (req: AddStudentRequest) => {
  try {
    const { data } = await axiosInstance.post<IResponse<AddStudentResponse>>(
      RootPath.students,
      req
    );
    return data.data;
  } catch (e) {
    errorHandler(e);
  }
};

export const updateStudent = async (req: UpdateStudentRequest) => {
  try {
    const { data } = await axiosInstance.put<IResponse<UpdateStudentResponse>>(
      RootPath.students,
      req
    );
    return data.data;
  } catch (e) {
    errorHandler(e);
  }
};

export const deleteStudent = async (id: number) => {
  try {
    return await axiosInstance.delete<IResponse<Boolean>>(
      RootPath.students + "/" + id
    );
  } catch (e) {
    errorHandler(e);
  }
};

export const getStudentById = async (id: number) => {
  try {
    const { data } = await axiosInstance.get<IResponse<StudentResponse>>(
      `${RootPath.students}/${id}`
    );
    return data.data;
  } catch (e) {
    errorHandler(e);
  }
};
