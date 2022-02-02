import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../app-shared/base/base.service';
import { ExpertWorkingGroup, ExpertWorkingGroupEdit } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ExpertWorkingGroupService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getExpertWorkingGroup(id: number): Observable<ExpertWorkingGroup> {
    var url = this.apiUrl + '/services/nrmsdomain/api/working-groups' + id;
    return this.http.get<ExpertWorkingGroup>(url);
  }

  getExpertWorkingGroups(): Observable<ExpertWorkingGroup[]> {
    var url = this.apiUrl + "/services/nrmsdomain/api/working-groups";
    return this.http.get<ExpertWorkingGroup[]>(url);
  }

  post(expertWorkingGroup: ExpertWorkingGroupEdit): Observable<ExpertWorkingGroup> {
    var url = this.apiUrl + "/services/nrmsdomain/api/working-groups";
    return this.http.post<ExpertWorkingGroup>(url, expertWorkingGroup);
  }

  put(expertWorkingGroup: ExpertWorkingGroupEdit): Observable<ExpertWorkingGroup> {
    var url = this.apiUrl + '/services/nrmsdomain/api/working-groups';
    return this.http.put<ExpertWorkingGroup>(url, expertWorkingGroup);
  }

  deleteExpertWorkingGroup(ExpertWorkingGroupId: number): Observable<Object> {
    var url = this.apiUrl + "/services/nrmsdomain/api/working-groups/" + ExpertWorkingGroupId;
    return this.http.delete(url);
  }
}
