import {Injectable} from '@angular/core';
import {BaseService} from '../app-shared/base/base.service';
import {Regulations} from './components/regulations-list/regulations.model';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TreeNode} from 'primeng/api';
import {certificate, RFP} from './components/rfp/rfp.model';
import {RegulationsCertificate} from './components/regulations-certificate/regulations-certificate.model';
import {Pagination} from '../app-shared/base/pagination.model';
import {BasicValueSearch} from '../basicinfo/basic-value/basic-value.model';

@Injectable({
  providedIn: 'root'
})
export class RegulationsService extends BaseService {
  url = '../../../assets/mock/Regulation.json';
  menuUrl = '../../../assets/mock/regulations-menu.json';

  constructor(private http: HttpClient) {
    super();
  }

  getCertificateList(pagination: Pagination): Observable<RegulationsCertificate[]> {
    const params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString())
      .set('sort', pagination.sort?.toString());
    const url = this.apiUrl + '/services/nrmsdomain/api/certificates';
    return this.http.get<RegulationsCertificate[]>(url, {params});
  }

  deleteCertificate(id: number): Observable<Object> {
    const url = this.apiUrl + '/services/nrmsdomain/api/certificates/' + id;
    return this.http.delete(url);
  }

  getRegulationsTree() {
    return this.http.get<any>(this.menuUrl);
  }

  getTotalCount(): Observable<number> {
    const url = this.apiUrl + '/services/nrmsdomain/api/certificates/certificate-count';
    return this.http.get<number>(url);
  }

  searchByTitle(title: string, pagination: Pagination): Observable<RegulationsCertificate[]> {
    const params = new HttpParams()
      .set('title', title)
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString())
      .set('sort', pagination.sort?.toString());

    const url = this.apiUrl + '/services/nrmsdomain/api/_search/certificates';
    return this.http.post<RegulationsCertificate[]>(url, title, {params});
  }

  getCountByTitle(title: string): Observable<number> {
    const url = this.apiUrl + '/services/nrmsdomain/api/certificates/certificate-count-by-title/' + title;
    return this.http.get<number>(url);
  }

  getByProducerId(producerId: number): Observable<RegulationsCertificate[]> {
    const url = this.apiUrl + '/services/nrmsdomain/api/certificates/certificate-by-producer/' + producerId;
    return this.http.get<RegulationsCertificate[]>(url);
  }

}
