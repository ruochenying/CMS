import { Course, CourseDetail, Schedule } from "./course";
import { StudentWithProfile } from "./student";
import { Teacher, TeacherProfile } from "./teacher";

export interface BasicStatistics {
  total: number; //总数
  lastMonthAdded: number; //近一个月内加入的数量
}
export interface GenderStatistics extends BasicStatistics {
  gender: { male: number; female: number; unknown: number };
}
export type Statistic = { amount: number; name: string; [key: string]: any };

export type StatisticsType = "student" | "teacher" | "course";

export interface StatisticsRequest {
  type?: StatisticsType;
}

export interface StatisticsOverviewResponse {
  course: BasicStatistics;
  student: GenderStatistics;
  teacher: GenderStatistics;
}
export interface ClassTimeStatistic {
  name: string;
  typeName: string;
  classTime: string[];
}

export interface ClassTimeStatistic {
  name: string;
  typeName: string;
  classTime: string[];
}

export interface CourseClassTimeStatistic extends Statistic {
  courses: ClassTimeStatistic[];
}

export interface StudentStatisticsResponse extends StudentWithProfile {}
export interface TeacherStatisticsResponse extends Teacher, TeacherProfile {}
export interface CourseStatisticsResponse
  extends CourseDetail,
    CourseClassTimeStatistic {}
