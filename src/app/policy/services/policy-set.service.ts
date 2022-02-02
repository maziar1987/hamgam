import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { ElementModel } from '../models/element.model';
import { EntityTypePermition } from '../models/entity-type-permition';
import { EntityTypePermitionInput } from '../models/entity-type-permition-input';
import { OrgUnitPolicySets } from '../models/org-unit-policy-sets';
import { PolicyActions } from '../models/policy-actions';
import { PolicyButtonGroup, PolicySet } from '../models/policy.model';
import { UserPolicySets } from '../models/user-policy-sets';

@Injectable({
  providedIn: 'root'
})
export class PolicySetService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getPolicySet(id: number) {
    let url = this.apiUrl + '/services/uaa/api/new-policy-set';
    if (id) {
      url = this.apiUrl + '/services/uaa/api/policy-sets/' + id;
    }
    return this.http.get<PolicySet>(url);
  }

  getPolicySets(): Observable<PolicySet[]> {
    const url = this.apiUrl + '/services/uaa/api/policy-sets';
    return this.http.get<PolicySet[]>(url);
  }
  getPolicyCategories(): Observable<ElementModel[]> {
    const url = this.apiUrl + '/services/uaa/api/policy-categories';
    return this.http.get<ElementModel[]>(url);
  }

  getPolicyCategoriesByEntity(entityName: string): Observable<PolicyActions> {
    const policyCategoryName = { objectId: null, objectType: null, policyCategoryName: this.appName + '.' + entityName } as PolicyButtonGroup;
    const url = this.apiUrl + '/services/uaa/api/policy-categories/current-user-policies';
    return this.http.post<PolicyActions>(url, policyCategoryName);
  }

  getEntityTypePermissions(input: EntityTypePermitionInput): Observable<EntityTypePermition[]> {
    const url = this.apiUrl + '/services/uaa/api/permissions/entity-permissions';
    return this.http.post<EntityTypePermition[]>(url, input);
  }

  post(policy: PolicySet): Observable<PolicySet> {
    const url = this.apiUrl + '/services/uaa/api/policy/';
    return this.http.post<PolicySet>(url, policy);
  }

  updateOrgUnitsPolicySets(policy): Observable<OrgUnitPolicySets[]> {
    const url = this.apiUrl + '/services/uaa/api/set-org-units-policy-sets';
    return this.http.post<OrgUnitPolicySets[]>(url, policy);
  }

  updateUsersPolicySets(policy): Observable<UserPolicySets[]> {
    const url = this.apiUrl + '/services/uaa/api/set-users-policy-sets';
    return this.http.post<UserPolicySets[]>(url, policy);
  }

  // policySetsUpdateUsers(policy: PolicySet): Observable<PolicySet> {
  //   const url = this.apiUrl + '/services/uaa/api/policy-sets-update-users/';
  //   return this.http.put<PolicySet>(url, policy);
  // }
  policySetsUpdateUsers(policyId: number, usersIds: number[]): Observable<any> {
    const url = this.apiUrl + '/services/uaa/api/policy-sets/users-ids/' + policyId;
    return this.http.put(url, usersIds);
  }
  put(policy: PolicySet): Observable<PolicySet> {
    const url = this.apiUrl + '/services/uaa/api/policy/';
    return this.http.put<PolicySet>(url, policy);
  }

  deletePolicy(policyId: number): Observable<any> {
    const url = this.apiUrl + '/services/uaa/api/policy-sets/' + policyId;
    return this.http.delete(url);
  }

  editPolicy(policy): Observable<any> {
    const url = this.apiUrl + '/services/uaa/api/policy-sets/';
    return this.http.put(url, policy);
  }

  getOrgUnitPolicySets(id): Observable<PolicySet[]> {
    const url = this.apiUrl + '/services/uaa/api/get-org-unit-policy-sets/' + id;
    return this.http.get<PolicySet[]>(url);
  }

  getUserList(): Observable<any> {
    const url = this.apiUrl + '/services/uaa/api/users';
    return this.http.get<any>(url);
  }

  getUserByPolicyId(id): Observable<any> {
    const url = this.apiUrl + '/services/uaa/api/policy-sets/users/' + id;
    return this.http.get<any>(url);
  }

}
