import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { Pagination, PaginationResponce } from 'src/app/app-shared/base/pagination.model';
import { TargetSpecification } from '../models/target-specification';
import { TargetSpecificationEdit } from '../models/target-specification-edit';

@Injectable({
  providedIn: 'root'
})
export class TargetSpecificationService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getTargetSpecification(id: number): Observable<TargetSpecification> {
    var url = this.apiUrl + "/services/nrmsdomain/api/target-specifications/" + id;
    return this.http.get<TargetSpecification>(url);
  }

  getTargetSpecificationsPages(certificateId: number, pagination: Pagination): Observable<PaginationResponce> {
    pagination.sort = ['targetTitle,asc'];
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());
    pagination.sort.forEach(sort => {
      params = params.append('sort', sort);
    });

    var url = this.apiUrl + "/services/nrmsdomain/api/target-specifications-pages/" + certificateId;
    return this.http.get<PaginationResponce>(url, { params });
  }

  getTargetSpecificationsList(certificateId: number): Observable<TargetSpecification[]> {
    var url = this.apiUrl + "/services/nrmsdomain/api/target-specification-list/" + certificateId;
    return this.http.get<TargetSpecification[]>(url);
  }

  post(person: TargetSpecificationEdit): Observable<TargetSpecification> {
    var url = this.apiUrl + "/services/nrmsdomain/api/target-specifications";
    return this.http.post<TargetSpecification>(url, person);
  }

  put(person: TargetSpecificationEdit): Observable<TargetSpecification> {
    var url = this.apiUrl + "/services/nrmsdomain/api/target-specifications";
    return this.http.put<TargetSpecification>(url, person);
  }

  deleteTargetSpecification(personId: number): Observable<Object> {
    var url = this.apiUrl + "/services/nrmsdomain/api/target-specifications/" + personId;
    return this.http.delete(url);
  }

  searchTargetSpecification(search: string, cetrificateId: number, pagination: Pagination): Observable<PaginationResponce> {
    pagination.sort = ['targetTitle,asc'];
    let params = new HttpParams()
      .set('value', search)
      .set('cetrificateId', cetrificateId.toString())
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());
    pagination.sort.forEach(sort => {
      params = params.append('sort', sort);
    });

    var url = this.apiUrl + "/services/nrmsdomain/api/_search/target-specifications";
    return this.http.post<PaginationResponce>(url, { value: search, cetrificateId: cetrificateId }, { params });
  }

}
