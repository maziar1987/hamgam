import { TargetSpecificationMember } from "./target-specification-member";

export interface TargetSpecificationEdit {
    id: number;
    targetTitle: string;
    activityTypeIds: number[];
    certificateId: number;
    targetSpecificationMembers: TargetSpecificationMember[];
}
