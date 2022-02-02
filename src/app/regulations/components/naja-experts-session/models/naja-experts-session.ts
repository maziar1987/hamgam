import { AppFile } from "src/app/app-file-manager/app-file.model";
import { NajaExpertsSessionEnactment } from "./naja-experts-session-enactment";
import { NajaExpertsSessionMember } from "./naja-experts-session-member";

export interface NajaExpertsSession {
    id: number;
    sessionTypeId: number;
    sessionTitle: string;
    sessionSubject: string;
    sessionDate: Date;
    startTime: string;
    endTime: string;
    sessionNo: number;
    invitationNo: number;
    sessionPlace: string;
    sessionCoordinator: string;
    sessionSummary: string;
    confirmationStatusRfpID: number;
    confirmationStatusTeamID: number;
    confirmationStatusProposalID: number;
    confirmationDescriptionRfp: string;
    confirmationDescriptionTeam: string;
    confirmationDescriptionProposal: string;
    certificateId: number;
    attachmentId: number;
    attachment: AppFile;
    enactments: NajaExpertsSessionEnactment[];
    sessionMembers: NajaExpertsSessionMember[];
}

export interface NajaExpertsSessionView {
  id: number;
  sessionType: string;
  sessionTitle: string;
  sessionSubject: string;
  sessionDate: Date;
  confirmationStatusRfp: string;
  confirmationStatusTeam: string;
  confirmationStatusProposal: string;
}
