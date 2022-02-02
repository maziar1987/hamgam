import { BaseService } from 'src/app/app-shared/base/base.service';
import { SupervisionContract } from './SupervisionContract.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupervisionContractService extends BaseService {

  constructor(private http: HttpClient) { super(); }

  getInitiation(certificateId: number): Observable<any> {
    const url = this.apiUrl + '/services/nrmsdomain/api/supervision-contracts/initiation/' + certificateId;
    return this.http.get<any>(url);
  }
  getSupervisionContractByCertificate(certificateId: number): Observable<SupervisionContract> {
    const url = this.apiUrl + '/services/nrmsdomain/api/supervision-contracts/find-by-certificate/' + certificateId;
    return this.http.get<SupervisionContract>(url);
  }
  save(SupervisionContract: SupervisionContract, attachment: File): Observable<SupervisionContract> {
    const url = this.apiUrl + '/services/nrmsdomain/api/supervision-contracts';
    let formData: FormData = new FormData();
    formData.append('supervisionContractDTO', new Blob([JSON.stringify(SupervisionContract)], { type: 'application/json' }));
    if (attachment)
      formData.append('file', attachment, attachment.name);
    return this.http.post<SupervisionContract>(url, formData);
  }
  update(SupervisionContract: SupervisionContract, attachment: File): Observable<any> {
    const url = this.apiUrl + '/services/nrmsdomain/api/supervision-contracts';
    const formData: FormData = new FormData();
    if (attachment)
      formData.append('file', attachment, attachment.name);
    formData.append('supervisionContractDTO', new Blob([JSON.stringify(SupervisionContract)], { type: 'application/json' }));
    return this.http.put<any>(url, formData);
  }
}
