import { Appointment, AppointmentHistory } from './sentence.model';


export interface Post {
  id: number;
  parentId?: number;
  name: string;
  directManage?: number;
  postStatuse: PostStatuse;
  postLayout: PostLayout;
  postType: PostType;
  organizationUnitId: number;
  appointments:Appointment[];
}export interface PostHistory {
  id: number;
  parentId?: number;
  name: string;
  directManage?: number;
  postStatuse: PostStatuse;
  postLayout: PostLayout;
  postType: PostType;
  orgUnitHistoryId: string;
  appointments:AppointmentHistory[];
}

export interface PostCopy {
  id: number;
  parentIds: number[];
  organizationUnitIds: number[];
}
export interface PostCreate {
  parentId?: number;
  name: string;
  directManage?: number;
  postStatuse: PostStatuse|string;
  postLayout: PostLayout|string;
  postType: PostType|string;
  organizationUnitId: number;
}
export interface PostEdit {
  id: number;
  parentId?: number;
  name: string;
  directManage?: number;
  postStatuse: PostStatuse|string;
  postLayout: PostLayout|string;
  postType: PostType|string;
  organizationUnitId: number;
}
export enum PostStatuse {
  active = 1,

  inactive=2,

  temporary=3
}
export enum PostLayout {
  left = 1,
  down=2
}
export enum PostType {
  excellentmanager = 1,
  deputy = 2,
  directorGeneral = 3,
  manager = 4,
  expert = 5,
  vicar = 6,
  consultant = 7,
  officer = 8
}
