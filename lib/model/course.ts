import { ListResponse, Paginator } from "./common";

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
  uid: string;
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

interface Sales {
  id: number;
  batches: number;
  price: number;
  earnings: number;
  paidAmount: number;
  studentAmount: number;
  paidIds: number[];
}

export interface Schedule {
  id: number;
  status: number;
  current: number;
  chapters: Chapter[];
  classTime: string[];
}

export interface Chapter {
  name: string;
  id: number;
  content: string;
  order: number;
}

export interface CourseDetail extends Course {
  sales: Sales;
  schedule: Schedule;
}

export type CourseDetailResponse = CourseDetail;

export type AddCourseRequest = Pick<
  Course,
  | "cover"
  | "detail"
  | "duration"
  | "durationUnit"
  | "maxStudents"
  | "name"
  | "price"
  | "startTime"
  | "uid"
> & { type: number | number[]; teacherId: number };

export type AddCourseResponse = Course;

export interface ScheduleRequest {
  scheduleId?: number;
  courseId?: number;
  current?: number;
  statue?: number;
  chapters?: Omit<Chapter, "id">[];
  classTime?: string[];
}

export interface UpdateCourseRequest {
  id: number;
}

export type UpdateCourseResponse = Course;

export interface StudentCourse {
  id: number;
  studentId: number;
  ctime: string;
  courseDate: string;
  course: Course;
}

export interface StudentOwnCoursesResponse extends ListResponse {
  courses: StudentCourse[];
}

export interface ClassSchedule extends Course {
  schedule: Schedule;
}
