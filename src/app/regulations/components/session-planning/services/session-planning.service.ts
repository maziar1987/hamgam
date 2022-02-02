import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { Pagination, PaginationResponce } from 'src/app/app-shared/base/pagination.model';
import { SessionPlanning, SessionPlanningEdit } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SessionPlanningService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getSessionPlanning(id: number): Observable<SessionPlanning> {
    var url = this.apiUrl + "/services/nrmsdomain/api/session-Plannings/" + id;
    return this.http.get<SessionPlanning>(url);
  }

  getSessionPlannings(pagination: Pagination, certificateId: number): Observable<PaginationResponce> {
    pagination.sort = ['sessionTime,asc'];
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());
    pagination.sort.forEach(sort => {
      params = params.append('sort', sort);
    });

    var url = this.apiUrl + "/services/nrmsdomain/api/session-Plannings-Pages/" + certificateId;
    return this.http.get<PaginationResponce>(url, { params });
  }

  post(person: SessionPlanningEdit): Observable<SessionPlanning> {
    var url = this.apiUrl + "/services/nrmsdomain/api/session-Plannings";
    return this.http.post<SessionPlanning>(url, person);
  }

  put(person: SessionPlanningEdit): Observable<SessionPlanning> {
    var url = this.apiUrl + "/services/nrmsdomain/api/session-Plannings";
    return this.http.put<SessionPlanning>(url, person);
  }

  deleteSessionPlanning(personId: number): Observable<Object> {
    var url = this.apiUrl + "/services/nrmsdomain/api/session-Plannings/" + personId;
    return this.http.delete(url);
  }

  searchSessionPlanning(search: string, cetrificateId: number, pagination: Pagination): Observable<PaginationResponce> {
    pagination.sort = ['sessionTime,asc'];
    let params = new HttpParams()
      .set('value', search)
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());
    pagination.sort.forEach(sort => {
      params = params.append('sort', sort);
    });

    var url = this.apiUrl + "/services/nrmsdomain/api/_search/session-Plannings";
    return this.http.post<PaginationResponce>(url, search, { params });
  }
}
