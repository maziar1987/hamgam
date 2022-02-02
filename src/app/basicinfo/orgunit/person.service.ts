import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { Pagination } from 'src/app/app-shared/base/pagination.model';
import { Person, PersonExtended, Person_, SearchPerson } from './person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService extends BaseService {

  constructor(
    private http: HttpClient) {
    super();
  }
  extendUser(person: Person): PersonExtended {
    var u = <PersonExtended>person;
    u.fullName = u.firstName + " " + u.lastName;
    return u;
  }
  // getChildOrgUnits(id: string): Observable<OrgunitCreate[]> {
  //   var url = this.apiUrl + "/api/app/orgUnit/" + id + "/children";
  //   return this.http.get<OrgunitCreate[]>(url);
  // }
  // getPost(id: string): Observable<Post> {
  //   var url = this.apiUrl + "/api/app/post/" + id;
  //   return this.http.get<Post>(url);
  // }
  // getOrgUnitWithDetails(id: string): Observable<Orgunit> {
  //   var url = this.apiUrl + "/api/app/orgUnit/" + id;
  //   return this.http.get<Orgunit>(url);
  // }
  // getOrgUnitByName(name: string): Observable<OrgunitCreate> {
  //   var url = this.apiUrl + "/api/app/orgUnit/byName?name=" + name;
  //   return this.http.get<OrgunitCreate>(url);
  // }
  getAll(): Observable<Person[]> {
    var url = this.apiUrl + "/services/basicinfo/api/people";
    return this.http.get<Person[]>(url);
  }
  // create(sentence:SentenceCreate): Observable<number> {
  //   var url = this.apiUrl + "/api/app/sentence";
  //   return this.http.post<number>(url,sentence);
  // }

  // editorg(org: PostCreate): Observable<null> {
  //     var url = this.apiUrl + "/api/app/post";
  //     return this.http.put<null>(url, org);
  //   }

  //   deleteorg(postid: string): Observable<Object> {
  //     var url = this.apiUrl + "/api/app/post/" + postid;
  //     return this.http.delete(url);
  //   }

  getPeople(pagination: Pagination): Observable<Person_[]> {
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());
      pagination.sort.forEach(sort => {
        params = params.append('sort', sort);
      });

    var url = this.apiUrl + "/services/basicinfo/api/people";
    return this.http.get<Person_[]>(url, { params });
  }

  getPeopleCount(): Observable<number> {
    var url = this.apiUrl + "/services/basicinfo/api/people_count";
    return this.http.get<number>(url);
  }

  getPersonByNationalCode(nationalCode: any): Observable<Person_> {
    var url = this.apiUrl + "/services/basicinfo/api/people_by_national_code/" + nationalCode;
    return this.http.get<Person_>(url);
  }

  getPersonByPersonnelCode(personnelCode: any) {
    var url = this.apiUrl + "/services/basicinfo/api/people_by_personnel_code/" + personnelCode;
    return this.http.get<Person_>(url);
  }

  searchPeople(search: SearchPerson, pagination: Pagination): Observable<Person_[]> {
    let params = new HttpParams()
      .set('value', search.value)
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());
      pagination.sort.forEach(sort => {
        params = params.append('sort', sort);
      });

    var url = this.apiUrl + "/services/basicinfo/api/people-simple-search";
    return this.http.post<Person_[]>(url, search, { params });
  }

}
