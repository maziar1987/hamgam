import { ActionAttributes } from "src/app/policy/models/action-attributes";
import { Field } from "./field";

export interface Action {
    id: number;
    type: string;
    name: string;
    persianName: string;
    fields: Field[];
    attributes: ActionAttributes;
}
