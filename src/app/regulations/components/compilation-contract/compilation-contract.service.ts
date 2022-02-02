import { CompilationContract } from '../compilation-contract/CompilationContract.model';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompilationContractPayment } from '../payment/paymant.model';

@Injectable({
  providedIn: 'root'
})
export class CompilationContractService extends BaseService {

  constructor(private http: HttpClient) { super(); }

  getCompilationContractsAmounts(certificateId: number): Observable<any> {
    const url = this.apiUrl + '/services/nrmsdomain/api/compilation-contracts/initiation/' + certificateId;
    return this.http.get<any>(url);
  }
  save(CompilationContract: CompilationContract, attachment: File): Observable<any> {
    
    const url = this.apiUrl + '/services/nrmsdomain/api/compilation-contracts';
    let formData: FormData = new FormData();
    formData.append('compilationContractDTO', new Blob([JSON.stringify(CompilationContract)], { type: 'application/json' }));
    if (attachment)
      formData.append('file', attachment, attachment.name);
    return this.http.post<CompilationContract>(url, formData);
  }
  getCompilationContractByCertificate(certificateId: number): Observable<CompilationContract> {
    const url = this.apiUrl + '/services/nrmsdomain/api/compilation-contracts/find-by-certificate/' + certificateId;
    return this.http.get<CompilationContract>(url);
  }
  update(notifyProgram: CompilationContract, attachment: File): Observable<any> {
    const url = this.apiUrl + '/services/nrmsdomain/api/compilation-contracts';
    const formData: FormData = new FormData();
    if (attachment)
      formData.append('file', attachment, attachment.name);
    formData.append('compilationContractDTO', new Blob([JSON.stringify(notifyProgram)], { type: 'application/json' }));
    return this.http.put<any>(url, formData);
  }

  initiationForPayment(certificateId: number): Observable<CompilationContractPayment> {
    const url = this.apiUrl + '/services/nrmsdomain/api/compilation-contracts/initiation-for-payment/' + certificateId;
    return this.http.get<CompilationContractPayment>(url);
  }
}
