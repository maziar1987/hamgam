export class BaseTheory {
  id: number;
  certificateId: number;
  registrationDate: Date;
  confirmationStatusRfpId: number;
  confirmationStatusTeamId: number;
  confirmationStatusProposalId: number;
  confirmationDescriptionRfp: string;
  confirmationDescriptionTeam: string;
  confirmationDescriptionProposal: string;
}

export interface BaseTheoryView {
  id: number;
  registrationDate: Date;
  confirmationStatusRfp: string;
  confirmationStatusTeam: string;
  confirmationStatusProposal: string;
}
