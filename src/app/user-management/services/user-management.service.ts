import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { Pagination, PaginationResponce } from 'src/app/app-shared/base/pagination.model';
import { User } from '../models/user';
import { UserEditInput } from '../models/user-edit-input';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getUser(id: number): Observable<User> {
    var url = this.apiUrl + "/services/uaa/api/users/" + id;
    return this.http.get<User>(url);
  }

  getUsers(pagination: Pagination): Observable<PaginationResponce> {
    pagination.sort = ['lastName,asc', 'firstName,asc', "login,asc"];
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());
    pagination.sort.forEach(sort => {
      params = params.append('sort', sort);
    });

    var url = this.apiUrl + "/services/uaa/api/users";
    return this.http.get<PaginationResponce>(url, { params });
  }

  getAuthorities(): Observable<string[]> {
    var url = this.apiUrl + "/services/uaa/api/users/authorities";
    return this.http.get<string[]>(url);
  }

  post(user: UserEditInput): Observable<User> {
    var url = this.apiUrl + "/services/uaa/api/users";
    return this.http.post<User>(url, user);
  }

  put(user: UserEditInput): Observable<User> {
    var url = this.apiUrl + "/services/uaa/api/users";
    return this.http.put<User>(url, user);
  }

  deleteUser(userName: string): Observable<Object> {
    var url = this.apiUrl + "/services/uaa/api/users/by-login/" + userName;
    return this.http.delete(url);
  }
}
