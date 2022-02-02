import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { PaymentDTO, PaymentTable } from './paymant.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService extends BaseService {
  
  constructor(private http: HttpClient) { super(); }

  getPaymentByCertificate(certificateId: number): Observable<PaymentDTO[]> {
    const url = this.apiUrl + '/services/nrmsdomain/api/payments-by-certificate-id/' + certificateId;
    return this.http.get<PaymentDTO[]>(url);
  }
  
  getPaymentById(Id: number): Observable<PaymentDTO> {
    const url = this.apiUrl + '/services/nrmsdomain/api/payments/' + Id;
    return this.http.get<PaymentDTO>(url);
  }
  save(WorkshopCertificateAdd: PaymentDTO, attachment: File): Observable<PaymentDTO> {
    const url = this.apiUrl + '/services/nrmsdomain/api/payments';
    let formData: FormData = new FormData();
    formData.append('paymentDTO', new Blob([JSON.stringify(WorkshopCertificateAdd)], { type: 'application/json' }));
    if (attachment)
      formData.append('file', attachment, attachment.name);
    return this.http.post<PaymentDTO>(url, formData);
  }
  update(WorkshopCertificateAdd: PaymentDTO, attachment: File): Observable<PaymentDTO> {
    const url = this.apiUrl + '/services/nrmsdomain/api/payments';
    let formData: FormData = new FormData();
    formData.append('paymentDTO', new Blob([JSON.stringify(WorkshopCertificateAdd)], { type: 'application/json' }));
    if (attachment)
      formData.append('file', attachment, attachment.name);
    return this.http.put<PaymentDTO>(url, formData);
  }
  delete(Id: number): Observable<any> {
    const url = this.apiUrl + '/services/nrmsdomain/api/payments/' + Id;
    return this.http.delete(url);
  }

}
