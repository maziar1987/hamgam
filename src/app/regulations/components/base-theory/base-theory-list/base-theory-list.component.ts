import {Component, OnInit} from '@angular/core';
import {BaseTheory, BaseTheoryView} from '../model/base-theory.model';
import {MenuItem} from 'primeng/api';
import {FormContainerChildBaseComponent} from '../../../../form-container/models/form-container-child-base-component';
import {BaseTheoryService} from '../service/base-theory.service';
import {BasicValue, BasicValueType} from '../../../../basicinfo/basic-value/basic-value.model';
import {ActivatedRoute, Router} from '@angular/router';
import {BasicValueService} from '../../../../basicinfo/basic-value/basic-value.service';
import {NajaExpertsSessionView} from '../../naja-experts-session/models/naja-experts-session';

@Component({
  selector: 'app-base-theory-list',
  templateUrl: './base-theory-list.component.html',
  styleUrls: ['./base-theory-list.component.scss']
})
export class BaseTheoryListComponent extends FormContainerChildBaseComponent implements OnInit {

  baseTheories: BaseTheoryView[] = [];
  selectedBaseTheory: BaseTheoryView;
  cols: any[];
  loading: boolean;
  certificateId: number;
  confirmationRfpValue: BasicValue[] = [];
  confirmationProposalValue: BasicValue[] = [];
  confirmationTeamValue: BasicValue[] = [];
  activityId: number;
  wfTaskId: any;
  activityType: any;

  constructor(
    private baseTheoryService: BaseTheoryService,
    private activatedRoute: ActivatedRoute,
    private basicValueService: BasicValueService,
    private router: Router
  ) {
    super();
    this.basicValueService.getBasicInfo(BasicValueType.confirmationStatusRfpBaseTheory).subscribe(basicValue => {
      this.confirmationRfpValue = basicValue.children;
    });
    this.basicValueService.getBasicInfo(BasicValueType.confirmationStatusTeamBaseTheory).subscribe(bi => {
      this.confirmationTeamValue = bi.children;
    });
    this.basicValueService.getBasicInfo(BasicValueType.confirmationStatusProposalBaseTheory).subscribe(bi => {
      this.confirmationProposalValue = bi.children;
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

  getMenuItems(rowNode: BaseTheoryView): MenuItem[] {
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

  loadData() {
    this.baseTheoryService.getBaseTheoryByCertificateId(this.certificateId).subscribe(baseTheories => {
      baseTheories.forEach(baseTheory => {
        this.baseTheories.push(this.createBaseTheoryView(baseTheory));
      });
    });
  }

  createBaseTheoryView(baseTheory: BaseTheory): BaseTheoryView {
    let rfp, proposal, team;
    rfp = this.confirmationRfpValue.find(x => x.id === baseTheory.confirmationStatusRfpId)?.title;
    proposal = this.confirmationProposalValue.find(x => x.id === baseTheory.confirmationStatusProposalId)?.title;
    team = this.confirmationTeamValue.find(x => x.id === baseTheory.confirmationStatusTeamId)?.title;
    return {
      id: baseTheory.id,
      registrationDate: baseTheory.registrationDate,
      confirmationStatusRfp: rfp,
      confirmationStatusProposal: proposal,
      confirmationStatusTeam: team
    } as BaseTheoryView;
  }

  setColumns() {
    this.translate.get('regulations.baseTheory').subscribe(res => {
      this.cols = [
        {field: 'confirmationStatusRfp', header: res.confirmationStatusRfp},
        {field: 'confirmationStatusTeam', header: res.confirmationStatusTeam},
        {field: 'confirmationStatusProposal', header: res.confirmationStatusProposal},
        {field: 'registrationDate', header: res.registrationDate}
      ];
    });
  }

  onCreate() {
    if (this.activityId) {
      this.router.navigate(['regulations/add-edit/base-theory/' + this.certificateId, {
        aid: this.activityId,
        wfTaskId: this.wfTaskId,
        activityType: this.activityType
      }]);
    } else {
      this.router.navigate(['regulations/add-edit/base-theory/' + this.certificateId]);
    }
  }

  onEdite(rowNode: BaseTheoryView) {
    if (this.activityId) {
      this.router.navigate(['regulations/add-edit/base-theory/' + this.certificateId, {
        aid: this.activityId,
        wfTaskId: this.wfTaskId,
        activityType: this.activityType,
        baseId: rowNode.id
      }]);
    } else {
      this.router.navigate(['regulations/add-edit/base-theory/' + this.certificateId, {
        baseId: rowNode.id
      }]);
    }
  }

  onDelete(rowNode: BaseTheoryView) {
  }

}
