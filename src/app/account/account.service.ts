import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from '../app-shared/base/base.service';
import { OrgUnitService } from '../basicinfo/org-unit/services/org-unit.service';
import { User } from '../user-management/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseService {

  private _currentAccount$ = new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient,
    private orgUnitService: OrgUnitService) {
    super();
  }

  get currentAccount$() { return this._currentAccount$.asObservable(); }

  loadCurrentAccount() {
    this.getCurrentAccount().subscribe(currentUser => {
      this.orgUnitService.getOrgUnitByUserId(currentUser.id).subscribe(orgUnit => {

        currentUser.orgUnit = orgUnit;
        this._currentAccount$.next(currentUser);

      }, error => {
        console.error(error);
      });
    }, error => {
      console.error(error);
    });
  }

  private getCurrentAccount(): Observable<User> {
    var url = this.apiUrl + "/services/uaa/api/account/";
    return this.http.get<User>(url);
  }
}
