import { TeamMemberDTO } from "../../specialized-team/specialized-team.model";
import { MemberType } from "./member-type.enum";

export interface TargetSpecificationMember {
    id: number;
    memberName: string;
    memberPost: string;
    memberType: MemberType;
    targetSpecificationId: number;
    teamMemberId: number;
    teamMember: TeamMemberDTO;
}
