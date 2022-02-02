import { Injectable } from '@angular/core';
import {BaseService} from '../../../app-shared/base/base.service';
import {Observable} from 'rxjs';
import {ContractSetting} from '../model/contract-setting.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContractSettingService extends BaseService{

  constructor(private http: HttpClient) {
    super();
  }

  loadData(): Observable<ContractSetting> {
    const url = this.apiUrl + '/services/nrms/api/contract-settings';
    return this.http.get<ContractSetting>(url);
  }

  save(contract: ContractSetting): Observable<ContractSetting> {
    const url = this.apiUrl + '/services/nrms/api/contract-settings';
    return this.http.post<ContractSetting>(url, contract);
  }

  update(contract: ContractSetting): Observable<ContractSetting> {
    const url = this.apiUrl + '/services/nrms/api/contract-settings';
    return this.http.put<ContractSetting>(url, contract);
  }
}
