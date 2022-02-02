import { User } from "src/app/user-management/models/user";

export interface ReceiverBCC {
    id: number;
    userId: number;
    user: User;
    activityId: number;
    seenTime: Date;
}
