import { User } from "src/app/user-management/models/user";

export interface ReceiverCC {
    id: number;
    userId: number;
    user: User;
    activityId: number;
    seenTime: Date;
}
