import {Injectable} from '@angular/core';
import {BaseService} from '../../../app-shared/base/base.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Organizing} from './organizing.model';
import {Worksheet} from './worksheet.model';
import {Proposal} from './proposal.model';
import {ProposalOrganizing} from './proposal-organizing.model';
import {WorksheetProposal} from './worksheet-proposal.model';

@Injectable({
  providedIn: 'root'
})
export class ProposalService extends BaseService {

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  getProposal(certificateId: number): Observable<Proposal> {
    const url = '/services/nrmsdomain/api/proposals/certificate/' + certificateId;
    return this.http.get<Proposal>(url);
  }

  getOrganizing(): Observable<Organizing[]> {
    const url = '/services/nrmsdomain/api/organizings';
    return this.http.get<Organizing[]>(url);
  }

  getWorkSheet(): Observable<Worksheet[]> {
    const url = '/services/nrmsdomain/api/worksheets';
    return this.http.get<Worksheet[]>(url);
  }

  save(proposal: Proposal, proposalOrganizings: ProposalOrganizing[], worksheetProposals: WorksheetProposal[]): Observable<any> {
    const url = '/services/nrmsdomain/api/proposals';
    const formData: FormData = new FormData();
    proposal.proposalAttachments.forEach(attachment => {
      formData.append('files', attachment.file.data, attachment?.file?.data.name);
      attachment.file = null;
    });
    formData.append('organizingDTO', new Blob([JSON.stringify(proposalOrganizings)], {type: 'application/json'}));
    formData.append('worksheetDto', new Blob([JSON.stringify(worksheetProposals)], {type: 'application/json'}));
    formData.append('proposalDTO', new Blob([JSON.stringify(proposal)], {type: 'application/json'}));
    return this.http.post<any>(url, formData);
  }

  update(proposal: Proposal, proposalOrganizings: ProposalOrganizing[], worksheetProposals: WorksheetProposal[]): Observable<any> {
    const url = '/services/nrmsdomain/api/proposals';
    const formData: FormData = new FormData();
    proposal.proposalAttachments.forEach(attachment => {
      if (attachment.file) {
        formData.append('files', attachment.file.data, attachment?.file?.data.name);
        attachment.file = null;
      }
    });
    formData.append('organizingDTO', new Blob([JSON.stringify(proposalOrganizings)], {type: 'application/json'}));
    formData.append('worksheetDto', new Blob([JSON.stringify(worksheetProposals)], {type: 'application/json'}));
    formData.append('proposalDTO', new Blob([JSON.stringify(proposal)], {type: 'application/json'}));
    return this.http.put<any>(url, formData);
  }
}
