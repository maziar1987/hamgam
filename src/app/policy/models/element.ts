import { Action } from "./action";

export interface Element {
    id: number;
    name: string;
    persianName: string;
    actions: Action[];
}
