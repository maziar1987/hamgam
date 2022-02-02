import {Injectable} from '@angular/core';
import {BaseService} from '../../../app-shared/base/base.service';
import {RegulationsCertificate} from './regulations-certificate.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CertificateStatus} from './certificate-status/certificate-status.model';
import {certificate} from '../rfp/rfp.model';
import {NajaExpertsSession} from '../naja-experts-session/models/naja-experts-session';

@Injectable({
  providedIn: 'root'
})
export class RegulationCertificateService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  save(certificate: RegulationsCertificate, certificateStatus: CertificateStatus, statusAttachment: File): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('certificateDTO', new Blob([JSON.stringify(certificate)], {type: 'application/json'}));
    formData.append('certificateStatusDTO', new Blob([JSON.stringify(certificateStatus)], {type: 'application/json'}));
    if (!statusAttachment) {
      formData.append('file', null);
    } else {
      formData.append('file', statusAttachment, statusAttachment.name);
    }
    const url = this.apiUrl + '/services/nrmsdomain/api/certificates';
    return this.http.post<RegulationsCertificate>(url, formData);
  }

  update(certificate: RegulationsCertificate): Observable<RegulationsCertificate> {
    const url = this.apiUrl + '/services/nrmsdomain/api/certificates';
    return this.http.put<RegulationsCertificate>(url, certificate);
  }

  getCertificate(id: number): Observable<RegulationsCertificate> {
    const url = this.apiUrl + '/services/nrmsdomain/api/certificates/' + id;
    return this.http.get<RegulationsCertificate>(url);
  }

  getCertificateById(id: number): Observable<RegulationsCertificate> {
    const url = this.apiUrl + '/services/nrmsdomain/api/certificates/' + id;
    return this.http.get<RegulationsCertificate>(url);
  }

  get(ids: number[]): Observable<RegulationsCertificate[]> {
    const url = '/services/nrmsdomain/api/certificates/certificate-by-list';
    return this.http.post<RegulationsCertificate[]>(url, ids);
  }
}
