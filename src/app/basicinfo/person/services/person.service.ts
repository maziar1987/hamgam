import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { Pagination, PaginationResponce } from 'src/app/app-shared/base/pagination.model';
import { Person } from '../models/person';
import { PersonEdit } from '../models/person-edit';
import { SearchValue } from '../models/search-value';

@Injectable({
  providedIn: 'root'
})
export class PersonService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getPerson(id: number): Observable<Person> {
    var url = this.apiUrl + "/services/basicinfo/api/people/" + id;
    return this.http.get<Person>(url);
  }

  getPeople(pagination: Pagination): Observable<Person[]> {
    pagination.sort = ['lastName,asc', 'firstName,asc'];
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());
    pagination.sort.forEach(sort => {
      params = params.append('sort', sort);
    });

    var url = this.apiUrl + "/services/basicinfo/api/people/";
    return this.http.get<Person[]>(url, { params });
  }

  post(person: PersonEdit): Observable<Person> {
    var url = this.apiUrl + "/services/basicinfo/api/people";
    return this.http.post<Person>(url, person);
  }

  put(person: PersonEdit): Observable<Person> {
    var url = this.apiUrl + "/services/basicinfo/api/people";
    return this.http.put<Person>(url, person);
  }

  deletePerson(personId: number): Observable<Object> {
    var url = this.apiUrl + "/services/basicinfo/api/people/" + personId;
    return this.http.delete(url);
  }

  searchPeople(search: SearchValue, pagination: Pagination): Observable<PaginationResponce> {
    pagination.sort = ['lastName,asc', 'firstName,asc'];
    let params = new HttpParams()
      .set('value', search.value)
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());
    pagination.sort.forEach(sort => {
      params = params.append('sort', sort);
    });

    var url = this.apiUrl + "/services/basicinfo/api/people-simple-search";
    return this.http.post<PaginationResponce>(url, search, { params });
  }

  getPeopleCount(): Observable<number> {
    var url = this.apiUrl + "/services/basicinfo/api/people_count";
    return this.http.get<number>(url);
  }
}
