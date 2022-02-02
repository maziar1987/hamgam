export class ProposalOrganizing {
  id: number;
  needTime: number;
  proposalId: number;
  organizingId: number;
  step: string;
  title: string;
  description: string;

  constructor(id: number, needTime: number, proposalId: number, organizingId: number, step: string, title: string, description: string) {
    this.id = id;
    this.needTime = needTime;
    this.proposalId = proposalId;
    this.organizingId = organizingId;
    this.step = step;
    this.title = title;
    this.description = description;
  }
}
