import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { EntityType } from '../models';
import { EntityTypeEdit } from '../models/entity-type-edit';

@Injectable({
  providedIn: 'root'
})
export class EntityTypeService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getEntityType(id: number): Observable<EntityType> {
    var url = this.apiUrl + "/services/uaa/api/entity-types/" + id;
    return this.http.get<EntityType>(url);
  }

  getEntityTypes(): Observable<EntityType[]> {
    var url = this.apiUrl + "/services/uaa/api/entity-types/";
    return this.http.get<EntityType[]>(url);
  }

  post(entityType: EntityTypeEdit): Observable<EntityType> {
    var url = this.apiUrl + "/services/uaa/api/entity-types";
    return this.http.post<EntityType>(url, entityType);
  }

  put(entityType: EntityTypeEdit): Observable<EntityType> {
    var url = this.apiUrl + "/services/uaa/api/entity-types";
    return this.http.put<EntityType>(url, entityType);
  }

  deleteEntityType(entityTypeId: number): Observable<Object> {
    var url = this.apiUrl + "/services/uaa/api/entity-types/" + entityTypeId;
    return this.http.delete(url);
  }
}
