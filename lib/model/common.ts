export interface IResponse<T = any> {
  data?: T;
  code: number;
  msg: string;
}

export interface Paginator {
  page: number;
  limit: number;
}
export interface ListResponse {
  total: number;
  paginator?: Paginator;
}

export interface BaseType {
  id: number;
  name: string;
}

export const programLanguageColors: string[] = [
  "magenta",
  "volcano",
  "orange",
  "gold",
  "green",
  "cyan",
  "geekblue",
  "purple",
  "red",
  "lime",
];
