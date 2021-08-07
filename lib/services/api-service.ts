import { RootPath, SubPath } from "./api-path";
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
  CoursesResponse,
  CourseRequest,
  CourseDetailResponse,
  CourseType,
  TeachersResponse,
  TeachersRequest,
  AddCourseRequest,
  AddCourseResponse,
  ScheduleRequest,
} from "../model";
import storage from "./storage";
import { message } from "antd";

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
    message.success(data.msg);
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
    message.success(data.msg);
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
    message.success(data.msg);
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
    message.success(data.msg);
    return data.data;
  } catch (e) {
    errorHandler(e);
  }
};

export const deleteStudent = async (id: number) => {
  try {
    const { data } = await axiosInstance.delete<IResponse<Boolean>>(
      RootPath.students + "/" + id
    );
    message.success(data.msg);
    return data.data;
  } catch (e) {
    errorHandler(e);
  }
};

export const getStudentById = async (id: number) => {
  try {
    const { data } = await axiosInstance.get<IResponse<StudentResponse>>(
      `${RootPath.students}/${id}`
    );
    message.success(data.msg);
    return data.data;
  } catch (e) {
    errorHandler(e);
  }
};

export const getCourses = async (req?: CourseRequest) => {
  try {
    const { data } = await axiosInstance.get<IResponse<CoursesResponse>>(
      RootPath.courses,
      {
        params: req,
      }
    );
    message.success(data.msg);
    return data.data;
  } catch (e) {
    errorHandler(e);
  }
};

export const getCourseById = async (id: number) => {
  try {
    const { data } = await axiosInstance.get<IResponse<CourseDetailResponse>>(
      `${RootPath.courses}/${SubPath.detail}`,
      { params: { id } }
    );
    message.success(data.msg);
    return data.data;
  } catch (e) {
    errorHandler(e);
  }
};

export const getCourseCode = async () => {
  try {
    const { data } = await axiosInstance.get<IResponse<string>>(
      `${RootPath.courses}/${SubPath.code}`,
      {}
    );
    return data.data;
  } catch (e) {
    errorHandler(e);
  }
};

export const getCourseType = async () => {
  try {
    const { data } = await axiosInstance.get<IResponse<CourseType[]>>(
      `${RootPath.courses}/${SubPath.type}`,
      {}
    );
    return data.data;
  } catch (e) {
    errorHandler(e);
  }
};

export const addCourse = async (req: AddCourseRequest) => {
  try {
    const { data } = await axiosInstance.post<IResponse<AddCourseResponse>>(
      RootPath.courses,
      req
    );
    message.success(data.msg);
    return data.data;
  } catch (e) {
    errorHandler(e);
  }
};
export const updateSchedule = async (req: ScheduleRequest) => {
  try {
    const { data } = await axiosInstance.put<IResponse<boolean>>(
      `${RootPath.courses}/${SubPath.schedule}`,
      req
    );
    message.success(data.msg);
    return data.data;
  } catch (e) {
    errorHandler(e);
  }
};

export const getTeachers = async (req?: TeachersRequest) => {
  try {
    const { data } = await axiosInstance.get<IResponse<TeachersResponse>>(
      RootPath.teachers,
      {
        params: req,
      }
    );
    message.success(data.msg);
    return data.data;
  } catch (e) {
    errorHandler(e);
  }
};
