import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api/treenode';
import { Observable } from 'rxjs';
import { BaseService } from '../../app-shared/base/base.service';
import { Orgunit, OrgunitCreate, OrgunitWhitUser } from './orgunit.model';

@Injectable({
  providedIn: 'root'
})
export class OrgunitService extends BaseService {

  selectedNode: TreeNode;
  public istree: boolean;

  constructor(
    private http: HttpClient) {
    super();
  }

  getChildOrgUnits(id: string): Observable<Orgunit[]> {
    var url = this.apiUrl + "/services/basicinfo/api/org-units/get-children/" + id;
    return this.http.get<Orgunit[]>(url);
  }
  getOrgUnit(id: number): Observable<Orgunit> {
    var url = this.apiUrl + "/services/basicinfo/api/org-units/" + id;
    return this.http.get<Orgunit>(url);
  }
  getOrgUnitWithDetails(id: number): Observable<OrgunitWhitUser> {
    var url = this.apiUrl + "/services/basicinfo/api/org-units/" + id;
    return this.http.get<OrgunitWhitUser>(url);
  }
  // getOrgUnitByName(name: string): Observable<Orgunit> {
  //   var url = this.apiUrl + "/api/app/orgUnit/byName?name=" + name;
  //   return this.http.get<Orgunit>(url);
  // }
  getOrgUnitByUserId(userId: number): Observable<Orgunit> {
    var url = this.apiUrl + "/services/basicinfo/api/org-unit-by-user-id/" + userId;
    return this.http.get<Orgunit>(url);
  }
  getAllOrgUnit(): Observable<Orgunit[]> {
    var url = this.apiUrl + "/services/basicinfo/api/org-units";
    return this.http.get<Orgunit[]>(url);
  }

  getOrgUnits(orgs: number[]): Observable<Orgunit[]> {
    var url = this.apiUrl + "/services/basicinfo/api/org-units-from-list";
    return this.http.post<Orgunit[]>(url, orgs);
  }

  createOrg(org: OrgunitCreate): Observable<any> {
    var url = this.apiUrl + "/services/basicinfo/api/org-units";
    return this.http.post<any>(url, org);
  }

  editorg(org: OrgunitCreate): Observable<null> {
    var url = this.apiUrl + "/services/basicinfo/api/org-units";
    return this.http.put<null>(url, org);
  }

  deleteorg(orgid: string): Observable<Object> {
    var url = this.apiUrl + "/services/basicinfo/api/org-units/" + orgid;
    return this.http.delete(url);
  }
}
