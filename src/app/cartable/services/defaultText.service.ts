import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../app-shared/base/base.service';
import { DefaultText } from '../models/defaultText.model';

@Injectable({
    providedIn: 'root',
})
export class DefaultTextService extends BaseService {

    url = "/services/cartable/api/default-texts/";

    constructor(
        private http: HttpClient) {
        super();
    }

    get(id: number): Observable<DefaultText> {
        var url = this.apiUrl + this.url + id;
        return this.http.get<DefaultText>(url);
    }

    getAll(): Observable<DefaultText[]> {
        var url = this.apiUrl + this.url;
        return this.http.get<DefaultText[]>(url);
    }

    insert(input: DefaultText): Observable<DefaultText> {
        const url = this.apiUrl + this.url;
        return this.http.post<DefaultText>(url, input);
    }

    update(input: DefaultText): Observable<void> {
        const url = this.apiUrl + this.url;
        return this.http.post<void>(url, input);
    }

    delete(id: number): Observable<void> {
        const url = this.apiUrl + this.url + id;
        return this.http.delete<void>(url);
    }

}