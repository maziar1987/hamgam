import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { Login } from './login.model';

@Injectable({ providedIn: 'root' })
export class LoginService extends BaseService {

  constructor(
    private http: HttpClient) {
    super();
  }

  login(lg: Login): Observable<any> {
    var url = this.apiUrl + "/auth/login";
    return this.http.post<any>(url, lg);
  }

  logout(): Observable<any> {
    var url = this.apiUrl + "/auth/logout";
    return this.http.post<any>(url, null);
  }

}
