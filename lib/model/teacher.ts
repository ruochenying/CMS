import { Paginator, ListResponse } from "./common";
import { Course } from "./course";

export interface Teacher {
  id: number;
  name: string;
  country: string;
  phone: number;
  skills: Skill[];
  courseAmount: number;
  profileId: number;
  email: string;
  ctime: string;
  updateAt: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface TeachersRequest extends Partial<Paginator> {
  query?: string;
}

export interface TeachersResponse extends ListResponse {
  teachers: Teacher[];
}
