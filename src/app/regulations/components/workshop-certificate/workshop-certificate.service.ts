import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { WorkshopCertificate } from './models/workshop-certificate-team';

@Injectable({
  providedIn: 'root'
})
export class WorkshopCertificateService extends BaseService{

  constructor(private http: HttpClient) {super();  }

  getWorkshopByCertificate(certificateId: number): Observable<WorkshopCertificate[]> {
    const url = this.apiUrl + '/services/nrmsdomain/api/get-all-workshop-certificates/' + certificateId;
    return this.http.get<WorkshopCertificate[]>(url);
  }
  save(WorkshopCertificateAdd: WorkshopCertificate, attachment: File): Observable<WorkshopCertificate> {
    const url = this.apiUrl + '/services/nrmsdomain/api/workshop-certificates';
    let formData: FormData = new FormData();
    formData.append('workshopCertificateDTO', new Blob([JSON.stringify(WorkshopCertificateAdd)], { type: 'application/json' }));
    if (attachment)
      formData.append('file', attachment, attachment.name);
    return this.http.post<WorkshopCertificate>(url, formData);
  }
  update(WorkshopCertificateAdd: WorkshopCertificate, attachment: File): Observable<WorkshopCertificate> {
    const url = this.apiUrl + '/services/nrmsdomain/api/workshop-certificates';
    let formData: FormData = new FormData();
    formData.append('workshopCertificateDTO', new Blob([JSON.stringify(WorkshopCertificateAdd)], { type: 'application/json' }));
    if (attachment)
      formData.append('file', attachment, attachment.name);
    return this.http.put<WorkshopCertificate>(url, formData);
  }
  getWorkshopById(Id: number): Observable<WorkshopCertificate> {
    const url = this.apiUrl + '/services/nrmsdomain/api/workshop-certificates/' + Id;
    return this.http.get<WorkshopCertificate>(url);
  }
}
