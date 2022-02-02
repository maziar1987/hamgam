import { TargetSpecification } from "../../target-specification/models/target-specification";
import { SessionMemberDuty } from "./session-member-duty";

export interface SessionPlanning {
    id: number;
    sessionDate: Date;
    sessionTime: string;
    certificateId: number;
    sessionMemberDuties: SessionMemberDuty[];
    targetSpecificationId: number;
    targetSpecification: TargetSpecification;
}
