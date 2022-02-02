import {CertificateStatus} from '../certificate-status/certificate-status.model';

export class RegulationsCertificate {
  id: number;
  unitId: number;
  title: string;
  regulationTypeId: number;
  registerNo: string;
  code: string;
  confidentialityId: number;
  compilationStatusId: number;
  producerId: number;
  confirmerId: number;
  applicationLevelId: number;
  applicationAreaId: number;
  certificateStatuses: CertificateStatus[];
}
