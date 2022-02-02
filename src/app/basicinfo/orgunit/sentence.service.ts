import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { SentenceCreate } from './sentence.model';

@Injectable({
  providedIn: 'root'
})
export class SentenceService extends BaseService {
  
  constructor(
    private http: HttpClient) {
    super();
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
  // getAllPost(): Observable<Post[]> {
  //   var url = this.apiUrl + "/api/app/post";
  //   return this.http.get<Post[]>(url);
  //  }
  create(sentence:SentenceCreate): Observable<number> {
    var url = this.apiUrl + "/services/basicinfo/api/appointments";
    return this.http.post<number>(url,sentence);
  }
  
// editorg(org: PostCreate): Observable<null> {
//     var url = this.apiUrl + "/api/app/post";
//     return this.http.put<null>(url, org);
//   }
  
//   deleteorg(postid: string): Observable<Object> {
//     var url = this.apiUrl + "/api/app/post/" + postid;
//     return this.http.delete(url);
//   }
}
