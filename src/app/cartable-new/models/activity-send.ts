import { ActivityObject } from './activity-obj';
import { Attachment } from './attachment';
import { Receiver } from './receiver';
import { ReceiverBCC } from './receiver-bcc';
import { ReceiverCC } from './receiver-cc';
import { SendType } from './send-type.enum';

export interface ActivitySend {
  sendType?: SendType;
  prevActivityId?: number;
  subject: string;
  text: string;
  receivers?: Receiver[];
  receiverCCs?: ReceiverCC[];
  receiverBCCs?: ReceiverBCC[];
  activityObject?: ActivityObject;
  attachments?: Attachment[];
  priorityId?: number;
  classificationId?: number;

  deadline?: Date;
}
