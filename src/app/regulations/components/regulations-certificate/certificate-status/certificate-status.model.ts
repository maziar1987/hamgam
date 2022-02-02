import {AppFile} from '../../../../app-file-manager/app-file.model';

export class CertificateStatus {
  id: number;
  statusId: number;
  causeId: number;
  startDate: Date;
  endDate: Date;
  prepareDate: Date;
  timeEstimate: number;
  creditEstimate: number;
  revisionLevelId: number;
  revisionCauseId: number;
  description: string;
  attachment: AppFile;
}

export class CertificateStatusList {
  id: number;
  statusDesc: string;
  startData: Date;
  endDate: Date;
  description: string;

  constructor(id: number, statusDesc: string, startData: Date, endDate: Date, description: string) {
    this.id = id;
    this.statusDesc = statusDesc;
    this.startData = startData;
    this.endDate = endDate;
    this.description = description;
  }
}
