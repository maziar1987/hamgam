import { OrgUnit } from "src/app/basicinfo/org-unit/models/org-unit";
import { Person } from "src/app/basicinfo/person/models/person";
import { PolicySet } from "src/app/policy/models/policy.model";

export interface User {
    id: number;
    login: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string;
    langKey: string;
    activated: boolean;
    authorities: string[];
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
    personId: number;
    person: Person;
    orgUnitId: number;
    orgUnit: OrgUnit;
    policySets: PolicySet[];
}
