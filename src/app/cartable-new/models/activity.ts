import {BasicValue} from 'src/app/basicinfo/basic-value/basic-value.model';
import {ActivityObject} from './activity-obj';
import {Attachment} from './attachment';
import {Receiver} from './receiver';
import {ReceiverBCC} from './receiver-bcc';
import {ReceiverCC} from './receiver-cc';
import {SendType} from './send-type.enum';
import {Sender} from './sender';

export interface Activity {
  id?: number;
  sendType: SendType;
  subject: string;
  processKey?: string;
  processStepKey?: string;
  text: string;
  priorityId?: number;
  priority?: BasicValue;
  classificationId?: number;
  classification?: BasicValue;
  creationTime?: Date;
  chainIndex?: string;
  startActivityId?: number;
  prevActivityId?: number;
  sender?: Sender;
  receivers?: Receiver[];
  receiverCCs?: ReceiverCC[];
  receiverBCCs?: ReceiverBCC[];
  activityObject?: ActivityObject;
  activityObjectInfo?: any;
  attachments?: Attachment[];
  attachmentsCount?: number;
  workflowName?: string;
  workflowStep?: string;
  lastActivity?: Activity;

  workflowPersianName: string;
  workflowStepPersianName: string;
  routerLink: string;

  deadline?: Date;
}
