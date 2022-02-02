import { BasicValue } from 'src/app/basicinfo/basic-value/basic-value.model';
import { ExpertPerson } from 'src/app/expert-person/expert-person.model';

export interface TeamModal {

  id: number;
  expertPerson: ExpertPerson;
  personImageFileUrl: any;
  expertPersonId: number;
  responsibilityId: number;
  responsibilityCode: number;
  responsibility: BasicValue;
  fullName: string;
  startDate: Date;
  endDate: Date;
  edit: boolean;
}

export interface TeamMemberDTO {
  id: number;
  certificateId: number;
  expertPersonId: number;
  expertPerson: ExpertPerson;
  responsibilityId: number;
  startDate: Date;
  endDate: Date;
}

export interface ExpertAppointment {
  expertWorkingGroupTitle: string;
  responsibilityId: number;
  responsibilityName: string;
  expertWorkingGroupId: number;
}

export interface TeamMember {
  certificateTitle: string;
  responsibilityName: string;
}

export enum Responsibility {
  Boss = 1,
  Secretary = 2,
  Member = 3,
  Supervisor = 4,
  Supervision = 5
}
