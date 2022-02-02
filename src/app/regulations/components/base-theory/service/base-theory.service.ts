import {Injectable} from '@angular/core';
import {BaseService} from '../../../../app-shared/base/base.service';
import {Observable} from 'rxjs';
import {BaseTheory} from '../model/base-theory.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BaseTheoryService extends BaseService {

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  save(baseTheory: BaseTheory): Observable<BaseTheory> {
    const url = this.apiUrl + '/services/nrmsdomain/api/base-theories';
    return this.http.post<BaseTheory>(url, baseTheory);
  }

  update(baseTheory: BaseTheory): Observable<BaseTheory> {
    const url = this.apiUrl + '/services/nrmsdomain/api/base-theories';
    return this.http.put<BaseTheory>(url, baseTheory);
  }

  getBaseTheoryByCertificateId(certificateId: number): Observable<BaseTheory[]> {
    const url = this.apiUrl + '/services/nrmsdomain/api/base-theories/by-certificate-id/' + certificateId;
    return this.http.get<BaseTheory[]>(url);
  }

  get(baseId: number): Observable<BaseTheory> {
    const url = this.apiUrl + '/services/nrmsdomain/api/base-theories/' + baseId;
    return this.http.get<BaseTheory>(url);
  }
}
