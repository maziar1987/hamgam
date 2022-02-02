import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../app-shared/base/base.service';
import { FormFile } from '../app-shared/base/form-file';
import { Pagination, PaginationResponce } from '../app-shared/base/pagination.model';
import { ExpertPerson, ExpertPersonInput, ExpertPersonStatusInput } from './expert-person.model';

@Injectable({
  providedIn: 'root',
})
export class ExpertPersonService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getExpertPerson(id: number): Observable<ExpertPerson> {
    var url = this.apiUrl + '/services/nrmsdomain/api/expert-people/' + id;
    return this.http.get<ExpertPerson>(url);
  }

  getExpertPersonWithFiles(id: number): Observable<ExpertPerson> {
    var url = this.apiUrl + '/api/app/expertPerson/' + id + '/WithFiles';
    return this.http.get<ExpertPerson>(url);
  }

  getExpertPeople(pagination: Pagination): Observable<PaginationResponce> {
    pagination.sort = ['lastEditTime,desc'];
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());
    pagination.sort.forEach(sort => {
      params = params.append('sort', sort);
    });

    var url = this.apiUrl + '/services/nrmsdomain/api/expert-people';
    return this.http.get<PaginationResponce>(url, { params });
  }

  getExpertPeopleByStatus(input: ExpertPersonInput): Observable<ExpertPerson[]> {
    var url = this.apiUrl + '/services/nrmsdomain/api/expert-people/by-status';
    return this.http.post<ExpertPerson[]>(url, input);
  }

  searchExpertPeople(search: { value: string; }, pagination: Pagination) {
    pagination.sort = ['lastEditTime,desc'];
    let params = new HttpParams()
      .set('value', search.value)
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());
    pagination.sort.forEach(sort => {
      params = params.append('sort', sort);
    });

    var url = this.apiUrl + '/services/nrmsdomain/api/expert-people/search/simple';
    return this.http.post<PaginationResponce>(url, search, { params });
  }

  // getChosenSupervisor(): Observable<User> {
  //   var url = this.apiUrl + '/services/nrmsdomain/api/get-chosen-supervisor/';
  //   return this.http.get<User>(url);
  // }

  post(expertPerson: ExpertPerson, files: FormFile[] | null): Observable<ExpertPerson> {
    var url = this.apiUrl + '/services/nrmsdomain/api/expert-people';

    var formData: FormData = new FormData();
    files?.forEach(data => {
      formData.append(data.name, data.file, data.file.name);
    });
    formData.append("expertPersonDTO", new Blob([JSON.stringify(expertPerson)], { type: 'application/json' }))

    return this.http.post<ExpertPerson>(url, formData);
  }

  put(expertPerson: ExpertPerson, files: FormFile[] | null): Observable<ExpertPerson> {
    var url = this.apiUrl + '/services/nrmsdomain/api/expert-people';

    var formData: FormData = new FormData();
    files?.forEach(data => {
      formData.append(data.name, data.file, data.file.name);
    });
    formData.append("expertPersonDTO", new Blob([JSON.stringify(expertPerson)], { type: 'application/json' }))

    return this.http.put<ExpertPerson>(url, formData);
  }

  deleteExpertPerson(expertPersonId: number): Observable<Object> {
    var url = this.apiUrl + '/services/nrmsdomain/api/expert-people/' + expertPersonId;
    return this.http.delete(url);
  }

  setStatus(input: ExpertPersonStatusInput): Observable<any> {
    var url = this.apiUrl + '/services/nrmsdomain/api/expert-people/set-status';
    return this.http.post<any>(url, input);
  }

}
