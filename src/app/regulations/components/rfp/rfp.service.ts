import {Injectable} from '@angular/core';
import {BaseService} from '../../../app-shared/base/base.service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AppFile} from '../../../app-file-manager/app-file.model';
import {Attachment, RFP} from './rfp.model';

@Injectable({
  providedIn: 'root'
})
export class RfpService extends BaseService {

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  save(rfp: RFP): Observable<any> {
    const url = this.apiUrl + '/services/nrmsdomain/api/rfps';
    const formData: FormData = new FormData();

    rfp.attachments.forEach(attachment => {
      formData.append('files', attachment.file, attachment.file.name);
    });

    formData.append('rfpDTO', new Blob([JSON.stringify(rfp)], {type: 'application/json'}));

    return this.http.post<any>(url, formData);
  }

  update(rfp: RFP): Observable<any> {
    const url = this.apiUrl + '/services/nrmsdomain/api/rfps';
    const formData: FormData = new FormData();

    rfp.attachments.forEach(attach => {
      if (attach.file) {
        formData.append('files', attach.file, attach.file?.name);
        attach.file = null;
      }
    });

    formData.append('rfpDTO', new Blob([JSON.stringify(rfp)], {type: 'application/json'}));
    return this.http.put<any>(url, formData);
  }

  getRfpByCertificate(certificateId: number): Observable<RFP> {
    const url = this.apiUrl + '/services/nrmsdomain/api/rfps/certificate/' + certificateId;
    return this.http.get<RFP>(url);
  }
}
