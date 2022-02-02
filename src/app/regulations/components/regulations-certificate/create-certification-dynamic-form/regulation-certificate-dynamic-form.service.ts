import {Injectable} from '@angular/core';
import {RegulationsCertificate} from './regulations-certificate.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegulationCertificateDynamicFormService {
  mockUrl = '../../../../assets/mock/certificate-dynamic-form.json';
  constructor(private http: HttpClient) {
  }

  getCertificate(): Observable<any> {
    return this.http.get<any>(this.mockUrl);
  }
}
