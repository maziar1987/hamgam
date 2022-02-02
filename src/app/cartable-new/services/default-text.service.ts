import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { DefaultText } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DefaultTextService extends BaseService {

  url = "/services/cartable/api/default-texts/";

  constructor(private http: HttpClient) {
    super();
  }

  getDefaultText(id: number): Observable<DefaultText> {
    var url = this.apiUrl + this.url + id;
    return this.http.get<DefaultText>(url);
  }

  getDefaultTexts(): Observable<DefaultText[]> {
    var url = this.apiUrl + this.url;
    return this.http.get<DefaultText[]>(url);
  }

  createDefaultText(input: DefaultText): Observable<DefaultText> {
    const url = this.apiUrl + this.url;
    return this.http.post<DefaultText>(url, input);
  }

  editDefaultText(input: DefaultText): Observable<void> {
    const url = this.apiUrl + this.url;
    return this.http.put<void>(url, input);
  }

  deleteDefaultText(id: number): Observable<void> {
    const url = this.apiUrl + this.url + id;
    return this.http.delete<void>(url);
  }

}
