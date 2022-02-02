import {Injectable} from '@angular/core';
import {BaseService} from '../../../../app-shared/base/base.service';
import {Observable} from 'rxjs';
import {CertificateStatus} from './certificate-status.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CertificateStatusService extends BaseService {
  url = '../../../../assets/mock/Status.json';

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  loadData(certificateId: number): Observable<CertificateStatus[]> {
    const url = this.apiUrl + '/services/nrmsdomain/api/certificate-statuses/certificate/' + certificateId;
    return this.http.get<CertificateStatus[]>(url);
  }

  get(statusId: number): Observable<CertificateStatus> {
    const url = this.apiUrl + '/services/nrmsdomain/api/certificate-statuses/' + statusId;
    return this.http.get<CertificateStatus>(url);
  }
}
