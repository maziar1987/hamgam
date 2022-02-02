import { Person } from './person.model';


export interface Appointment {
  id: number;
  startDate: string;
  endDate: string;
  paperDate: string;
  paperNumber: string;
  personId: number;
  person: Person;
}
export interface AppointmentHistory {
  id: number;
  startDate: string;
  endDate: string;
  paperDate: string;
  paperNumber: string;
  personId: number;
  personHistory: Person;
}
export interface SentenceCreate {
  id: number;
  startDate: string;
  endDate: string;
  paperDate: string;
  paperNumber: string;
  personId: number;
  postId: number;
}
// export interface PostEdit {
//   id: number;
//   parentId?: number;
//   name: string;
//   directManage?: number;
//   postStatuse: PostStatuse;
//   postLayout: PostLayout;
//   postType: PostType;
//   organizationUnitId: string;
// }
export enum SentenceType {
  FirstPerson = 1,

  SecondPerson=2
}