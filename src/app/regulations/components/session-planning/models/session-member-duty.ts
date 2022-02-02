import { TargetSpecificationMember } from "../../target-specification/models/target-specification-member";

export interface SessionMemberDuty {
    id: number;
    duty: string;
    sessionPlanningId: number;
    targetSpecificationMemberId: number;
    targetSpecificationMember: TargetSpecificationMember;
}
