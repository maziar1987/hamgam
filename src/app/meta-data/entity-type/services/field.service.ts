import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { Field } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FiledService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getFields(): Observable<Field> {
    var url = this.apiUrl + "/services/uaa/api/fields/";
    return this.http.get<Field>(url);
  }

//   getEntityTypes(): Observable<EntityType[]> {
//     var url = this.apiUrl + "/services/uaa/api/entity-types/";
//     return this.http.get<EntityType[]>(url);
//   }

//   post(entityType: EntityTypeEdit): Observable<EntityType> {
//     var url = this.apiUrl + "/services/uaa/api/entity-types";
//     return this.http.post<EntityType>(url, entityType);
//   }

//   put(entityType: EntityTypeEdit): Observable<EntityType> {
//     var url = this.apiUrl + "/services/uaa/api/entity-types";
//     return this.http.put<EntityType>(url, entityType);
//   }

//   deleteEntityType(entityTypeId: number): Observable<Object> {
//     var url = this.apiUrl + "/services/uaa/api/entity-types/" + entityTypeId;
//     return this.http.delete(url);
//   }
}
