import {Attachment} from '../rfp/rfp.model';
import {AppFile} from '../../../app-file-manager/app-file.model';
import {ProposalOrganizing} from './proposal-organizing.model';
import {WorksheetProposal} from './worksheet-proposal.model';

export class Proposal {
  id: number;
  compilationNecessity: string;
  compilationImportance: string;
  regulationAbstract: string;
  history: string;
  generalFramework: string;
  certificateId: number;
  proposalOrganizings: ProposalOrganizing[];
  worksheetProposals: WorksheetProposal[];
  proposalAttachments: Attachment[];
}
