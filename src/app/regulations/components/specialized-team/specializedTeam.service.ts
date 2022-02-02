import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { ExpertAppointment, TeamMemberDTO } from './specialized-team.model';
@Injectable({
    providedIn: 'root'
})
export class SpecializesTeamService extends BaseService {
    constructor(private http: HttpClient) { super(); }

    save(teamMembers: TeamMemberDTO[], deletedIds: number[]): Observable<any> {
        const url = this.apiUrl + '/services/nrmsdomain/api/team-members-multi';
        const formData: FormData = new FormData();
        formData.append('created', new Blob([JSON.stringify(teamMembers)], { type: 'application/json' }));
        formData.append('deleted', new Blob([JSON.stringify(deletedIds)], { type: 'application/json' }));
        return this.http.post<any>(url, formData);
    }
    getSpecializesTeamByCertificate(certificateId: number): Observable<TeamMemberDTO[]> {
        const url = this.apiUrl + '/services/nrmsdomain/api/team-members/certificate/' + certificateId;
        return this.http.get<TeamMemberDTO[]>(url);
    }
    deleteSpecializesTeam(Id: number): Observable<any> {
        const url = this.apiUrl + '/services/nrmsdomain/api/team-members/' + Id;
        return this.http.delete(url);
    }
    getExpertAppointments(Id: number): Observable<ExpertAppointment[]>{
        const url = this.apiUrl + '/services/nrmsdomain/api/expert-appointments/expert-person/' + Id;
        return this.http.get<ExpertAppointment[]>(url);
    }
    getTeamMembers(Id: number): Observable<any>{
        const url = this.apiUrl + '/services/nrmsdomain/api/team-members/expert-person/' + Id;
        return this.http.get<any>(url);
    }
}
