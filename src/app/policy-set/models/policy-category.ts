import { Action } from "./action";

export interface PolicyCategory {
    id: number;
    name: string;
    persianName: string;
    children: PolicyCategory[];
    actions: Action[];
}
