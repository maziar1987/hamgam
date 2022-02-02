import { ActionAttributes } from "./action-attributes";

export interface Action {
    id: number;
    name: string;
    persianName: string;
    attributes: ActionAttributes;
    // fields: FieldsModel[] ;
}
