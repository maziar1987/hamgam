import { SessionMemberDutyEdit } from "./session-member-duty-edit";

export interface SessionPlanningEdit {
    id: number;
    sessionDate: Date;
    sessionTime: string;
    certificateId: number;
    sessionMemberDuties: SessionMemberDutyEdit[];
    targetSpecificationId: number;
}
