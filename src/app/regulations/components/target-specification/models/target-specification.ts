import { BasicValue } from "src/app/basicinfo/basic-value/basic-value.model";
import { TargetSpecificationMember } from "./target-specification-member";

export interface TargetSpecification {
    id: number;
    targetTitle: string;
    activityTypeIds: number[];
    activityTypes: BasicValue[];
    certificateId: number;
    targetSpecificationMembers: TargetSpecificationMember[];
}
