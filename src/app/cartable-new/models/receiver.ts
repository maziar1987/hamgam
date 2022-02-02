import {User} from 'src/app/user-management/models/user';
import {ActionType} from './action-type.enum';

export interface Receiver {
  id: number;
  userId: number;
  user: User;
  activityId: number;
  actionType: ActionType;
  seenTime: Date;
  workflowTaskId: string;
}
