import { BasicValue } from 'src/app/basicinfo/basic-value/basic-value.model';
import { Receiver, ReceiverBCC, ReceiverCC, Sender } from '../../user/user.model';

export interface ActivityBase {
  id?: number;
  sendType?: string;

  sender?: Sender;
  receivers: Receiver[];
  receiverCCs: ReceiverCC[];
  receiverBCCs: ReceiverBCC[];

  subject: string;
  text: string;

  activityObject?: ObjectReference;

  creationTime?: Date;
  deadTime?: Date;

  attachmentsCount?: number;

  attachments?: ObjectReference[];

  priorityId?: number;
  classificationId?: number;

  priority?: BasicValue;
  classification?: BasicValue;

  prevActivityId?: number;
  chainIndex?: string;

  activityType?: any;
}

export interface ActivityList extends ActivityBase {
}

export interface ActivityView extends ActivityBase {
  attachments: ObjectReference[];
  firstView: boolean;
}

export interface ActivityHistory extends ActivityBase {
}

export interface ActivitySend {
  sendType: SendType;
  prevActivityId?: number;

  subject?: string;
  text?: string;

  deadTime?: Date;

  receivers: number[];
  receiverCCs?: number[];
  receiverBCCs?: number[];

  activityObject?: ObjectReference;

  attachments?: ObjectReference[];

  priorityId: number;
  classificationId: number;
}

export enum SendType {
  COMPOSE = 0,
  FORWARD = 1,
  REPLY = 2,
  SENDBACK = 3
}


export interface ObjectReference {
  id?: number;
  name: string;
  objectType: string;
  objectId?: number;
  guid?: string;

  object?: any;
}
