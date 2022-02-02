import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../app-shared/base/base.service';
import {Observable} from 'rxjs';
import {NotifyCertificate, NotifyProgram, NotifyProgramView} from '../model/notify-program.model';

@Injectable({
  providedIn: 'root'
})
export class NotifyProgramService extends BaseService {

  constructor(public http: HttpClient) {
    super();
  }

  getAllNotify(): Observable<NotifyProgram[]> {
    const url = this.apiUrl + '/services/nrmsdomain/api/notify-programs';
    return this.http.get<NotifyProgram[]>(url);
  }

  get(id: number): Observable<NotifyProgram> {
    const url = this.apiUrl + '/services/nrmsdomain/api/notify-programs/' + id;
    return this.http.get<NotifyProgram>(url);
  }

  save(notifyProgram: NotifyProgram, attachment: File): Observable<any> {
    const url = this.apiUrl + '/services/nrmsdomain/api/notify-programs';
    let formData: FormData = new FormData();
    formData.append('notifyProgramDTO', new Blob([JSON.stringify(notifyProgram)], {type: 'application/json'}));
    if (!attachment) {
      formData.append('file', null);
    } else {
      formData.append('file', attachment, attachment.name);
    }
    return this.http.post<NotifyProgram>(url, formData);
  }

  update(notifyProgram: NotifyProgram, attachment: File): Observable<NotifyProgram> {
    const url = this.apiUrl + '/services/nrmsdomain/api/notify-programs';
    const formData: FormData = new FormData();
    if (!attachment) {
      formData.append('file', null);
    } else {
      formData.append('file', attachment, attachment.name);
    }
    formData.append('notifyProgramDTO', new Blob([JSON.stringify(notifyProgram)], {type: 'application/json'}));
    return this.http.put<NotifyProgram>(url, formData);
  }

  getNotifyByCertificateIds(certificateIds: number[]): Observable<NotifyProgram[]> {
    const url = '/services/nrmsdomain/api/notify-programs/by-certificate-id/' + certificateIds;
    return this.http.get<NotifyProgram[]>(url);
  }

  delete(id: number): Observable<any> {
    const url = this.apiUrl + '/services/nrmsdomain/api/notify-programs/' + id;
    return this.http.delete(url);
  }

  findByCertificate(certificateId: number): Observable<NotifyProgram> {
    const url = '/services/nrmsdomain/api/notify-certificates/find-by-certificateId' + certificateId;
    return this.http.get<NotifyProgram>(url);
  }

}
