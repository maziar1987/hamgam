import {Attachment, certificate} from '../../regulations/components/rfp/rfp.model';
import {OrgUnit} from '../../basicinfo/org-unit/models/org-unit';
import {RegulationsCertificate} from '../../regulations/components/regulations-certificate/regulations-certificate.model';
import {AppFile} from '../../app-file-manager/app-file.model';

export class NotifyProgram {
  id: number;
  orgUnitId: number;
  programYear: number;
  letterNo: string;
  createdDate: Date;
  attachment: AppFile;
  notifyCertificates: NotifyCertificate[];
}

export class NotifyProgramView {
  id: number;
  orgUnit: string;
  programYear: number;
  letterNo: string;
  createdDate: Date;

  constructor(id: number, orgUnit: string, programYear: number, letterNo: string, createdDate: Date) {
    this.id = id;
    this.orgUnit = orgUnit;
    this.programYear = programYear;
    this.letterNo = letterNo;
    this.createdDate = createdDate;
  }
}

export class NotifyCertificate {
  id: number;
  certificateId: number;
  notifyProgramId: number;
  description: string;
  registerNo: string;
  code: string;
}

export class CertificateView {
  id: number;
  title: string;
  status: string;
  type: string;
  description: string;
  certificateId: number;
  notifyId: number;
  selected: string;
  registerNo: string;
  code: string;
}


