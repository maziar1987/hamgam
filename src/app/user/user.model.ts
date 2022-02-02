import { Orgunit } from "../basicinfo/orgunit/orgunit.model";

export interface User {
  id: number;

  firstName: string;
  lastName: string;
  email: string;
  authorities: string[];
  orgunit: Orgunit;
}

// export enum AuthorityType {
//   ROLE_ADMIN,
//   ROLE_USER,
//   ROLE_MANAGER,
//   ROLE_EXPERT_EXPERTPERSON,
//   ROLE_EXPERT_WORKINGGROUP,
//   ROLE_SUPERVISOR  
// }

export interface UserExtended extends User {
  fullname: string;
}

export interface Sender {
  id: number;

  userId: number
  user: User;
}

export interface ReceiverBase {
  id: number;

  userId: number
  user: User;
  wfTaskId: any;
  actionType: any;
  viewTime?: Date;
}

export interface Receiver extends ReceiverBase {
  deadTime?: Date;
  endTime?: Date;
}

export interface ReceiverCC extends ReceiverBase {

}

export interface ReceiverBCC extends ReceiverBase {

}
