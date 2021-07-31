import { Paginator } from "./common";

export interface CourseShort {
  id: number;
  courseId: number;
  name: string;
}

type DurationUnit = 1 | 2 | 3 | 4 | 5;

type CourseStatus = 0 | 1 | 2;

export interface CourseType {
  id: number;
  name: string;
}

export interface Course {
  id: number;
  name: string;
  uid: string; //code
  detail: string;
  startTime: string;
  price: number;
  maxStudents: number;
  star: number;
  status: CourseStatus;
  duration: number;
  durationUnit: DurationUnit;
  cover: string;
  teacherName: string;
  teacherId: number;
  type: CourseType[];
  ctime: string;
  scheduleId: number;
}

export interface CourseRequest extends Paginator {
  uid?: string;
  name?: string;
  type?: number;
  userId?: number;
  own?: any;
}

export interface CoursesResponse {
  total: number;
  courses: Course[];
  paginator: Paginator;
}
