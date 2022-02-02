import {Field} from "./field";

export interface Action {
    id: number;
    name: string;
    persianName: string;
    fields: Field[];
}