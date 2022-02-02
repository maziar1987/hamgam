import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItemDynamic } from 'src/app/app-shared/components/sidebar/models/menu-item-dynamic';
import { PolicySet } from 'src/app/policy/models/policy.model';
import { BaseService } from '../../app-shared/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class MenuManagementService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getMenus(): Observable<MenuItemDynamic[]> {
    const url = this.apiUrl + '/services/uaa/api/menus';
    return this.http.get<MenuItemDynamic[]>(url);
  }

  getUserMenus(userId: number): Observable<MenuItemDynamic[]> {
    const url = this.apiUrl + '/services/uaa/api/menus/user-menus';
    return this.http.post<MenuItemDynamic[]>(url, { userId: userId });
  }

  setMenus(input: PolicySet): Observable<PolicySet> {
    const url = this.apiUrl + '/services/uaa/api/policy-sets';
    return this.http.put<PolicySet>(url, input);
  }
}
