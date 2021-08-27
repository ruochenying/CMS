import { Statistic } from ".";
import { ListResponse, Paginator } from "./common";
import { CourseShort, Course } from "./course";

export interface StudentsResponse {
  total: number;
  students: Student[];
  paginator: Paginator;
}

export interface Student<T = CourseShort> {
  createdAt: string;
  updatedAt: string;
  id: number;
  email: string;
  name: string;
  country: string;
  profileId: number;
  type: StudentType;
  courses: T[];
}

export interface StudentType {
  id: number;
  name: string;
}

export interface StudentsRequest extends Paginator {
  query?: string;
  userId?: number;
}

export interface UpdateStudentRequest extends AddStudentRequest {
  id: number;
}

export interface AddStudentRequest {
  name: string;
  country: string;
  email: string;
  type: number;
}
export type AddStudentResponse = Student;

export type UpdateStudentResponse = Student;

export interface StudentRequest {
  id: number;
}

export type StudentResponse = StudentWithProfile;

export interface StudentWithProfile extends Student<Course>, StudentProfile {}

export interface StudentProfile {
  id: number;
  name: string;
  country: string;
  email: string;
  address: string;
  phone: number;
  gender: number;
  education: string;
  age: number;
  interest: string[];
  avatar: string;
  memberStartAt: string;
  memberEndAt: string;
  description: string;
}

export interface StudentOwnStatisticsResponse {
  own: Statistic;
  recommend: Statistic;
}
