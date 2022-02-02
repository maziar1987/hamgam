export class Regulations {
  id: number;
  title: string;
  status: string;
  creationDate: Date;
  unit: string;
  unitId: number;
  statusId: number;
  notifyProgramYear: number;
  notifyLetterNo: string;
  notifyAttachmentId: number;

  constructor(id: number, title: string, statusId: number, creationDate: Date, unitId: number, notifyProgramYear: number, notifyLetterNo: string) {
    this.id = id;
    this.title = title;
    this.creationDate = creationDate;
    this.statusId = statusId;
    this.unitId = unitId;
    this.notifyProgramYear = notifyProgramYear;
    this.notifyLetterNo = notifyLetterNo;
  }
}
