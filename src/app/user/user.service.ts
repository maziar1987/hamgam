import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../app-shared/base/base.service';
import { Pagination } from '../app-shared/base/pagination.model';
import { User, UserExtended } from './user.model';

@Injectable({
    providedIn: 'root',
})
export class UserService extends BaseService {

    constructor(
        private http: HttpClient) {
        super();
    }

    public curUser: User;
    public allUsers: User[];

    public unreadCount: number = 0;

    extendUser(user: User): UserExtended {
        var u = <UserExtended>user;
        u.fullname = u.firstName + " " + u.lastName;
        return u;
    }

    getCurrentUser(): Observable<any> {
        var url = this.apiUrl + "/services/uaa/api/account/";
        return this.http.get<User>(url);
    }

    getUser(id: number): Observable<User> {
        var url = this.apiUrl + "/services/uaa/api/users-by-id/" + id;
        return this.http.get<User>(url);
    }

    // getAllUser(): Observable<User[]> {
    //     var url = this.apiUrl + "/services/uaa/api/users?page=0&size=100000";
    //     return this.http.get<User[]>(url);
    // }

    getAllUser(pagination?: Pagination): Observable<User[]> {
        let params = new HttpParams()
            .set('page', pagination.page.toString())
            .set('size', pagination.size.toString())
            .set('sort', pagination.sort[0]);

        var url = this.apiUrl + "/services/uaa/api/users";
        return this.http.get<User[]>(url, { params });
    }

    getUnreadCount(): Observable<number> {
        var url = this.apiUrl + "/api/app/activity/unreadCount"
        return this.http.get<number>(url);
    }

    login(userName: string, password: string): Observable<User> {
        return;//this.authService.login(userName, password);
    }

    logout(): Observable<void> {
        return;// this.authService.logout();
    }

    isLoggedIn(): boolean {
        // var x = this.config.getOne("currentUser");
        return;// x.userName ? true : false;
    }
    currentUserName(): string {
        // var user = this.config.getOne("currentUser");
        return;//user.userName;
    }

}
