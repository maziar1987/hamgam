import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../app-shared/base/base.service';
import { Pagination } from '../../app-shared/base/pagination.model';
import {
  BasicValue,
  BasicValueCreate,
  BasicValueInput,
  BasicValueMovementInput,
  BasicValueSearch,
  BasicValueUpdate
} from './basic-value.model';


@Injectable({
  providedIn: 'root',
})
export class BasicValueService extends BaseService {

  constructor(
    private http: HttpClient) {
    super();
  }

  getBasicInfo(id: number): Observable<BasicValue> {
    const url = this.apiUrl + '/services/basicinfo/api/basic-value/' + id;
    return this.http.get<BasicValue>(url);
  }

  getBasicInfoWithChildren(id: number): Observable<BasicValue> {
    const url = this.apiUrl + '/services/basicinfo/api/basic-value-with-children-by-id/' + id;
    return this.http.get<BasicValue>(url);
  }

  getBasicInfoWithChildrenByParameter(input: BasicValueInput): Observable<BasicValue> {
    const url = this.apiUrl + '/services/basicinfo/api/basic-value-with-children-by-parameter/';
    return this.http.post<BasicValue>(url, input);
  }

  getBasicInfosByParentId(input: BasicValueInput): Observable<BasicValue[]> {
    const url = this.apiUrl + '/api/app/basicInfo/byParentId';
    return this.http.post<BasicValue[]>(url, input);
  }

  getBasicValuesByCodes(codes: string[]): Observable<BasicValue[]> {
    const url = this.apiUrl + '/services/basicinfo/api/basic-values-from-list';
    return this.http.post<BasicValue[]>(url, codes);
  }

  getBasicValuesByIds(ids: number[]): Observable<BasicValue[]> {
    const url = this.apiUrl + '/services/basicinfo/api/basic-values-from-ids';
    return this.http.post<BasicValue[]>(url, ids);
  }

  loadBasicValues(pagination: Pagination): Observable<any> {
    const params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString())
      .set('sort', pagination.sort?.toString());
    const url = this.apiUrl + '/services/basicinfo/api/basic-values';
    return this.http.get<any>(url, { params });
  }

  post(basicInfo: BasicValueCreate): Observable<BasicValue> {
    const url = this.apiUrl + '/services/basicinfo/api/basic-value';
    return this.http.post<BasicValue>(url, basicInfo);
  }

  put(basicInfo: BasicValueUpdate): Observable<BasicValue> {
    const url = this.apiUrl + '/services/basicinfo/api/basic-value';
    return this.http.put<BasicValue>(url, basicInfo);
  }

  deleteBasicInfo(basicInfoId: number): Observable<Object> {
    const url = this.apiUrl + '/services/basicinfo/api/basic-value/' + basicInfoId;
    return this.http.delete(url);
  }

  getByParent(parentId: number): Observable<any> {
    const url = this.apiUrl + '/services/basicinfo/api/basic-value/children/' + parentId;
    return this.http.get<any>(url);
  }

  getByParentId(parentId: number, pagination: Pagination): Observable<any> {
    const params = new HttpParams()
      .set('parentId', parentId.toString())
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString())
      .set('sort', pagination.sort?.toString());
    const url = this.apiUrl + '/services/basicinfo/api/basic-value/get-by-parent-id';
    return this.http.post<any>(url, parentId, {params});
  }

  fillComboBox(parentId: number): Observable<BasicValue[]> {
    const url = this.apiUrl + '/services/basicinfo/api/basic-value/fill-combo-box/' + parentId;
    return this.http.get<BasicValue[]>(url);
  }

  cutBasicInfo(input: BasicValueMovementInput): Observable<BasicValue> {
    const url = this.apiUrl + '/api/app/basicInfo/cut';
    return this.http.post<BasicValue>(url, input);
  }

  copyBasicInfo(input: BasicValueMovementInput): Observable<BasicValue> {
    const url = this.apiUrl + '/api/app/basicInfo/copy';
    return this.http.post<BasicValue>(url, input);
  }

  getBasicValueCount(): Observable<number> {
    const url = this.apiUrl + '/services/basicinfo/api/basic-value-count';
    return this.http.get<number>(url);
  }

  searchByTitle(title: string, pagination: Pagination): Observable<BasicValueSearch> {
    const params = new HttpParams()
      .set('title', title)
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString())
      .set('sort', pagination.sort?.toString());

    const url = this.apiUrl + '/services/basicinfo/api/_search/basic-values/';
    return this.http.post<BasicValueSearch>(url, title, { params });
  }

  getRoot(id: number): Observable<BasicValue[]> {
    const url = this.apiUrl + '/services/basicinfo/api/basic-value/full-root-basic/' + id;
    return this.http.get<BasicValue[]>(url);
  }

}
