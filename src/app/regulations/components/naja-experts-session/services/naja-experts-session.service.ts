import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { NajaExpertsSession } from '../models/naja-experts-session';

@Injectable({
  providedIn: 'root'
})
export class NajaExpertsSessionService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getNajaExpertsSession(id: number): Observable<NajaExpertsSession> {
    const url = this.apiUrl + '/services/nrmsdomain/api/naja-experts-sessions/' + id;
    return this.http.get<NajaExpertsSession>(url);
  }

  getNajaExpertsSessions(): Observable<NajaExpertsSession[]> {
    const url = this.apiUrl + '/services/nrmsdomain/api/naja-experts-sessions/';
    return this.http.get<NajaExpertsSession[]>(url);
  }

  getNajaExpertsSessionsByCertificateId(certificateId: number): Observable<NajaExpertsSession[]> {
    const url = this.apiUrl + '/services/nrmsdomain/api/naja-experts-sessions-by-certificateId/' + certificateId;
    return this.http.get<NajaExpertsSession[]>(url);
  }

  getLastSessionByCertificate(certificateId: number): Observable<NajaExpertsSession> {
    const url = this.apiUrl + '/services/nrmsdomain/api/naja-experts-sessions/last-session-by-certificate-id/' + certificateId;
    return this.http.get<NajaExpertsSession>(url);
  }

  save(najaExpertsSession: NajaExpertsSession, attachmentFile: File): Observable<NajaExpertsSession> {
    const url = this.apiUrl + '/services/nrmsdomain/api/naja-experts-sessions/';
    return this.http.post<NajaExpertsSession>(url, this.getSessionFormData(najaExpertsSession, attachmentFile));
  }

  update(najaExpertsSession: NajaExpertsSession, attachmentFile: File): Observable<NajaExpertsSession> {
    const url = this.apiUrl + '/services/nrmsdomain/api/naja-experts-sessions/';
    return this.http.put<NajaExpertsSession>(url, this.getSessionFormData(najaExpertsSession, attachmentFile));
  }

  deleteNajaExpertsSession(najaExpertsSessionId: number): Observable<Object> {
    const url = this.apiUrl + '/services/nrmsdomain/api/naja-experts-sessions/' + najaExpertsSessionId;
    return this.http.delete(url);
  }

  getSessionFormData(najaExpertsSession: NajaExpertsSession, attachmentFile: File): any {
    const formData: FormData = new FormData();
    if (attachmentFile) {
      formData.append('attachment', attachmentFile, attachmentFile.name);
    }
    formData.append('najaExpertsSessionDTO', new Blob([JSON.stringify(najaExpertsSession)], { type: 'application/json' }));

    return formData;
  }

  getSession(id: number): Observable<NajaExpertsSession> {
    const url = this.apiUrl + '/services/nrmsdomain/api/naja-experts-sessions/' + id;
    return this.http.get<NajaExpertsSession>(url);
  }
}
