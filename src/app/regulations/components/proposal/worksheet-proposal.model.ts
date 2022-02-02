export class WorksheetProposal {
  id: number;
  worksheetCount: number;
  worksheetAmount: number;
  proposalId: number;
  worksheetId: number;
  title: string;
  children: WorksheetProposal[];


  constructor(id: number, worksheetCount: number, worksheetAmount: number, proposalId: number, worksheetId: number, stepTitle: string) {
    this.id = id;
    this.worksheetCount = worksheetCount;
    this.worksheetAmount = worksheetAmount;
    this.proposalId = proposalId;
    this.worksheetId = worksheetId;
    this.title = stepTitle;
  }
}
