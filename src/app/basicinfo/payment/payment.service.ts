import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { PaymentMethod } from './model/payment-method';

@Injectable({
  providedIn: 'root'
})
export class PaymentService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  save(contract: PaymentMethod): Observable<PaymentMethod> {
    const url = this.apiUrl + '/services/nrmsdomain/api/payment-methods';
    return this.http.post<PaymentMethod>(url, contract);
  }
  getById(id: number): Observable<PaymentMethod> {
    const url = this.apiUrl + '/services/nrmsdomain/api/payment-methods/' + id;
    return this.http.get<PaymentMethod>(url);
  }
  update(contract: PaymentMethod): Observable<PaymentMethod> {
    const url = this.apiUrl + '/services/nrmsdomain/api/payment-methods';
    return this.http.put<PaymentMethod>(url, contract);
  }
  getAll(): Observable<PaymentMethod[]> {
    const url = this.apiUrl + '/services/nrmsdomain/api/payment-methods' ;
    return this.http.get<PaymentMethod[]>(url);
  }
  delete(Id: number): Observable<any> {
    const url = this.apiUrl + '/services/nrmsdomain/api/payment-methods/' + Id;
    return this.http.delete(url);
  }
  
  getDropdown(): Observable<PaymentMethod[]> {
    const url = this.apiUrl + '/services/nrmsdomain/api/available-payment-methods' ;
    return this.http.get<PaymentMethod[]>(url);
  }
}
