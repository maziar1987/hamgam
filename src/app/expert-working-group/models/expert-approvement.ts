import { BasicValue } from "src/app/basicinfo/basic-value/basic-value.model";
import { ExpertPerson } from "src/app/expert-person/expert-person.model";

export interface ExpertApprovement {
    id: number;
    expertPerson: ExpertPerson;
    expertPersonId: number;
    responsibilityId: number;
    responsibility: BasicValue;
    startDate: Date;
    endDate: Date;
    status: boolean;
    isActive: boolean;
}
