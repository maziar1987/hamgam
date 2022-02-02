import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { Orgunit } from '../../orgunit/orgunit.model';
import { OrgUnit } from '../models/org-unit';
import { OrgUnitInput } from '../models/org-unit-input';

@Injectable({
  providedIn: 'root'
})
export class OrgUnitService extends BaseService {

  selectedTreeNode: TreeNode | null = null;

  constructor(private http: HttpClient) {
    super();
  }

  createTreeNode(orgUnit: OrgUnit, parent: TreeNode): TreeNode {
    return <TreeNode>{
      label: orgUnit.displayName,
      data: orgUnit,
      leaf: false,
      parent: parent,
      styleClass: !orgUnit.activated ? 'tree-background-color' : '',
      children: []
    };
  }

  getOrgUnit(id: number): Observable<OrgUnit> {
    var url = this.apiUrl + "/services/basicinfo/api/org-units/" + id;
    return this.http.get<OrgUnit>(url);
  }

  getOrgUnitByParent(input: OrgUnitInput): Observable<OrgUnit[]> {
    var url = this.apiUrl + "/services/basicinfo/api/org-units-by-parent";
    return this.http.post<OrgUnit[]>(url, input);
  }

  getOrgUnitByUserId(userId: number): Observable<OrgUnit> {
    var url = this.apiUrl + "/services/basicinfo/api/org-unit-by-user-id/" + userId;
    return this.http.get<OrgUnit>(url);
  }

  post(org: OrgUnit): Observable<OrgUnit> {
    var url = this.apiUrl + "/services/basicinfo/api/org-units";
    return this.http.post<OrgUnit>(url, org);
  }

  put(org: OrgUnit): Observable<OrgUnit> {
    var url = this.apiUrl + "/services/basicinfo/api/org-units";
    return this.http.put<OrgUnit>(url, org);
  }

  deleteOrgUnit(orgUnitId: number): Observable<any> {
    var url = this.apiUrl + "/services/basicinfo/api/org-units/" + orgUnitId;
    return this.http.delete(url);
  }

  getOrgUnits(orgs: number[]): Observable<Orgunit[]> {
    const url = this.apiUrl + '/services/basicinfo/api/org-units-from-list';
    return this.http.post<Orgunit[]>(url, orgs);
  }

  countByParentId(id: number): Observable<number> {
    const url = this.apiUrl + '/services/basicinfo/api/org-units/org-unit-count-by-parent/' + id;
    return this.http.get<number>(url);
  }

  getOrgUnitByParentAndActivated(id: number,  activeMode: boolean | null ): Observable<OrgUnit[]> {
    const  url = this.apiUrl + '/services/basicinfo/api/org-units/org-unit-by-parent-activated';
    return this.http.post<OrgUnit[]>(url, {parentId: id, activated: activeMode});
  }
}
