import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { OrgunitCreate, Orgunit, OrgunitWhitUser } from './orgunit.model';
import { TreeNode } from 'primeng/api/treenode';
import { chart } from './chart.model';
import { Post, PostHistory } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class ChartHistoryService extends BaseService {
  
  selectedNode: TreeNode;
 public istree: boolean;

  constructor(
    private http: HttpClient) {
    super();
  }

//   getChildOrgUnits(id: string): Observable<Orgunit[]> {
//     var url = this.apiUrl + "/api/app/orgUnit/" + id + "/children";
//     return this.http.get<Orgunit[]>(url);
//   }
//   getOrgUnit(id: string): Observable<Orgunit> {
//     var url = this.apiUrl + "/api/app/orgUnit/" + id;
//     return this.http.get<Orgunit>(url);
//   }
//   getOrgUnitWithDetails(id: string): Observable<OrgunitWhitUser> {
//     var url = this.apiUrl + "/api/app/orgUnit/" + id;
//     return this.http.get<OrgunitWhitUser>(url);
//   }
//   getOrgUnitByName(name: string): Observable<Orgunit> {
//     var url = this.apiUrl + "/api/app/orgUnit/byName?name=" + name;
//     return this.http.get<Orgunit>(url);
//   }
  getAllChart(): Observable<chart[]> {
    var url = this.apiUrl + "/services/basicinfo/api/org-chart-histories";
    return this.http.get<chart[]>(url);
  }
  createChart(): Observable<string> {
    var url = this.apiUrl + "/services/basicinfo/api/org-chart-histories";
    return this.http.post<string>(url,"");
  }
  getAllOrg(key:string): Observable<Orgunit[]> {
    var url = this.apiUrl + "/services/basicinfo/api/org-unit-histories-by-chart-key/"+key;
    return this.http.get<Orgunit[]>(url);
  }
  getAllPost(key:string): Observable<PostHistory[]> {
    var url = this.apiUrl + "/services/basicinfo/api/post-histories-by-chart-key/"+key;
    return this.http.get<PostHistory[]>(url);
   }
// editorg(org: OrgunitCreate): Observable<null> {
//     var url = this.apiUrl + "/api/app/orgUnit";
//     return this.http.put<null>(url, org);
//   }
  
//   deleteorg(orgid: string): Observable<Object> {
//     var url = this.apiUrl + "/api/app/orgUnit/" + orgid;
//     return this.http.delete(url);
//   }
}
