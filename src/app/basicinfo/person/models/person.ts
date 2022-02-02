import { BasicValue } from "../../basic-value/basic-value.model";
import { Orgunit } from "../../orgunit/orgunit.model";

export interface Person {
    id: number;
    lastName: string;
    firstName: string;
    nationalCode: string;
    fatherName: string;
    birthDate: Date;
    educationDegreeId: number;
    educationDegree: BasicValue;
    organizationName: string;
    organizationId: number;
    organization: Orgunit;
    employmentDate: Date;
    rankId: number;
    rank: BasicValue;
    studyFieldId: number;
    studyField: BasicValue;
    personnelCode: string;
}
