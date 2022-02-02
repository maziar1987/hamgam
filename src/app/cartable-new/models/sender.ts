import { User } from "src/app/user-management/models/user";

export interface Sender {
    id: number;
    userId: number;
    user: User;
    wfTaskId: string;
}
