import { Rule } from "./rule";

export interface ActionAttributes {
    id: number;
    active: Boolean;
    rules: Rule[];
    actionId: number;
    policySetId: number;
}
