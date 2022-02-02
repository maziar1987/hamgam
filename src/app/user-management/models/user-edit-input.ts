import { PolicySet } from "src/app/policy/models/policy.model";

export interface UserEditInput {
    id: number;
    login: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    langKey: string;
    activated: boolean;
    authorities: string[];
    personId: number;
    policySets: PolicySet[];
}
