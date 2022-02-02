import {Component, OnInit} from '@angular/core';
import {FormContainerChildBaseComponent} from '../../../../form-container/models/form-container-child-base-component';
import {NajaExpertsSession, NajaExpertsSessionView} from '../models/naja-experts-session';
import {NajaExpertsSessionService} from '../services/naja-experts-session.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BasicValue, BasicValueType} from '../../../../basicinfo/basic-value/basic-value.model';
import {Regulations} from '../../regulations-list/regulations.model';
import {MenuItem} from 'primeng/api';
import {BasicValueService} from '../../../../basicinfo/basic-value/basic-value.service';

@Component({
  selector: 'app-naja-experts-session-list',
  templateUrl: './naja-experts-session-list.component.html',
  styleUrls: ['./naja-experts-session-list.component.scss']
})
export class NajaExpertsSessionListComponent extends FormContainerChildBaseComponent implements OnInit {

  cols: any[];
  loading: boolean;
  najaExpertsSessions: NajaExpertsSessionView[] = [];
  selectedNajaExpertsSession: NajaExpertsSession;
  confirmationRfpValue: BasicValue[] = [];
  confirmationProposalValue: BasicValue[] = [];
  confirmationTeamValue: BasicValue[] = [];
  najaExpertSessionTypeValue: BasicValue[] = [];
  certificateId: number;
  activityId: number;
  wfTaskId: any;
  activityType: any;

  constructor(
    private najaExpertsSessionService: NajaExpertsSessionService,
    private activatedRoute: ActivatedRoute,
    private basicValueService: BasicValueService,
    private router: Router
  ) {
    super();
    this.basicValueService.getBasicInfo(BasicValueType.confirmationStatusTeam).subscribe(basicValue => {
      this.confirmationRfpValue = basicValue.children;
    });
    this.basicValueService.getBasicInfo(BasicValueType.confirmationStatusTeam).subscribe(bi => {
      this.confirmationTeamValue = bi.children;
    });
    this.basicValueService.getBasicInfo(BasicValueType.confirmationStatusTeam).subscribe(bi => {
      this.confirmationProposalValue = bi.children;
    });
    this.basicValueService.getBasicInfo(BasicValueType.najaExpertsSessionType).subscribe(bi => {
      this.najaExpertSessionTypeValue = bi.children;
    });
  }

  ngOnInit(): void {
    this.setColumns();
    this.activatedRoute.paramMap.subscribe(p => {
      this.activityId = +p.get('aid');
      this.wfTaskId = +p.get('wfTaskId');
      this.activityType = p.get('activityType');
      this.certificateId = +p.get('id');
      this.loadData();
    });
  }

  setColumns() {
    this.translate.get('regulations.najaExpertsSession').subscribe(res => {
      this.cols = [
        {field: 'sessionType', header: res.sessionType},
        {field: 'sessionTitle', header: res.sessionTitle},
        {field: 'sessionSubject', header: res.sessionSubject},
        {field: 'confirmationStatusRfp', header: res.confirmationStatusRfp},
        {field: 'confirmationStatusTeam', header: res.confirmationStatusTeam},
        {field: 'confirmationStatusProposal', header: res.confirmationStatusProposal},
        {field: 'sessionDate', header: res.sessionDate}
      ];
    });
  }

  loadData() {
    this.loading = true;
    this.najaExpertsSessionService.getNajaExpertsSessionsByCertificateId(this.certificateId).subscribe(sessions => {
      sessions.forEach(session => {
        this.najaExpertsSessions.push(this.createSession(session));
      });
      this.loading = false;
    }, error => {
      console.log(error);
    });
  }

  createSession(najaExpertsSession: NajaExpertsSession): NajaExpertsSessionView {
    let rfp, proposal, team, sessionType;
    rfp = this.confirmationRfpValue.find(x => x.id === najaExpertsSession.confirmationStatusRfpID)?.title;
    proposal = this.confirmationProposalValue.find(x => x.id === najaExpertsSession.confirmationStatusProposalID)?.title;
    team = this.confirmationTeamValue.find(x => x.id === najaExpertsSession.confirmationStatusTeamID)?.title;
    sessionType = this.najaExpertSessionTypeValue.find(x => x.id === najaExpertsSession.sessionTypeId)?.title;
    return {
      id: najaExpertsSession.id,
      sessionSubject: najaExpertsSession.sessionSubject,
      sessionTitle: najaExpertsSession.sessionTitle,
      sessionType,
      sessionDate: najaExpertsSession.sessionDate,
      confirmationStatusRfp: rfp,
      confirmationStatusProposal: proposal,
      confirmationStatusTeam: team
    } as NajaExpertsSessionView;
  }

  getMenuItems(rowNode: NajaExpertsSessionView): MenuItem[] {
    let action: any;
    this.translate.get('action').subscribe(res => {
      action = res;
    });

    const items = [] as MenuItem[];
    items.push(
      {
        label: action.edit, icon: 'pi pi-pencil', command: () => {
          this.onEdite(rowNode);
        }
      }/*, {
        label: action.delete, icon: 'pi pi-times', command: () => {
          this.onDelete(rowNode);
        }
      }*/);
    return items;
  }

  onCreate() {
    if (this.activityId) {
      this.router.navigate(['regulations/add-edit/naja-experts-session/' + this.certificateId, {
        aid: this.activityId,
        wfTaskId: this.wfTaskId,
        activityType: this.activityType
      }]);
    } else {
      this.router.navigate(['regulations/add-edit/naja-experts-session/' + this.certificateId]);
    }
  }

  onEdite(rowNode: NajaExpertsSessionView) {
    if (this.activityId) {
      this.router.navigate(['regulations/add-edit/naja-experts-session/' + this.certificateId, {
        aid: this.activityId,
        wfTaskId: this.wfTaskId,
        activityType: this.activityType,
        sessionId: rowNode.id
      }]);
    } else {
      this.router.navigate(['regulations/add-edit/naja-experts-session/' + this.certificateId, {
        sessionId: rowNode.id
      }]);
    }
  }

  onDelete(rowNode: NajaExpertsSessionView) {
  }

}
