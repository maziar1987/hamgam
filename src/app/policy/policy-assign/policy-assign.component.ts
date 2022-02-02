import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TreeNode } from 'primeng';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { Orgunit } from 'src/app/basicinfo/orgunit/orgunit.model';
import { utils } from '../../app-shared/utils';
import { OrgUnitPolicySets } from '../models/org-unit-policy-sets';
import { PolicySet } from '../models/policy.model';
import { SetPolicysetModel } from '../models/set-policyset.model';
import { PolicySetService } from '../services/policy-set.service';


@Component({
  selector: 'app-policy-assign',
  templateUrl: './policy-assign.component.html',
  styleUrls: ['./policy-assign.component.scss']
})
export class PolicyAssignComponent extends BaseComponent implements OnInit, OnChanges {
  setPolicySetModel: SetPolicysetModel = new SetPolicysetModel();
  orgUnits: Orgunit[];
  selectedOrgUnitId: number;
  policies: PolicySet[] = [];
  cols: any[];
  loading: boolean;
  firstPolicySets: PolicySet[] = [];
  changedOrgUnits: { [orgUnitId: number]: OrgUnitPolicySets; } = {};

  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
  utils: any;

  constructor(
    private policyService: PolicySetService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setCols();
    this.loadData();
    this.utils = utils;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadData();
  }

  loadData() {
    this.policyService.getPolicySets().subscribe(policies => {
      this.policies = policies;
    }, error => {
      console.error(error);
    });
  }

  setCols() {
    this.translate.get('policy').subscribe(policy => {
      this.cols = [
        { field: 'name', header: policy.name },
        { field: 'active', header: policy.isActive },
        { field: 'lastEditDate', header: policy.editDate }
      ];
    });
  }


  hide() {
    this.visibleChange.emit(false);
  }

  onBack() {
    this.visible = false;
    this.visibleChange.emit(false);
  }


  submit() {
    if (this.selectionChanged(this.firstPolicySets, this.setPolicySetModel.policySet)) {
      this.rememberOrgUnit(this.selectedOrgUnitId, this.setPolicySetModel.policySet);
    }

    const orgUnitsPolicySets: OrgUnitPolicySets[] = [];

    for (const key in this.changedOrgUnits)
      orgUnitsPolicySets.push(this.changedOrgUnits[key]);

    this.policyService.updateOrgUnitsPolicySets(orgUnitsPolicySets).subscribe(() => {
      this.visible = false;
      this.visibleChange.emit(false);
    }, error => {
      console.error(error);
    });
  }


  nodeSelect(event: TreeNode) {

    if (!event.data.id) return;

    if (this.selectedOrgUnitId && this.selectionChanged(this.firstPolicySets, this.setPolicySetModel.policySet)) {
      this.rememberOrgUnit(this.selectedOrgUnitId, this.setPolicySetModel.policySet);
    }

    this.selectedOrgUnitId = event.data.id;

    this.firstPolicySets = this.policies.filter(x => x.orgUnitsIds.includes(this.selectedOrgUnitId));
    this.setPolicySetModel.policySet = this.firstPolicySets;
  }

  selectionChanged(prevPolicySets: PolicySet[], newPolicySets: PolicySet[]): boolean {
    const addList = newPolicySets.filter(x => !prevPolicySets.includes(x));
    const removeList = prevPolicySets.filter(x => !newPolicySets.includes(x));

    if (addList.length === 0 && removeList.length === 0) {
      return false;
    }

    addList.forEach(x => {
      x.orgUnitsIds.push(this.selectedOrgUnitId);
    });
    removeList.forEach(x => {
      x.orgUnitsIds = x.orgUnitsIds.filter(y => y !== this.selectedOrgUnitId);
    });

    return true;
  }

  rememberOrgUnit(orgUnitId: number, policySets: PolicySet[]) {
    this.changedOrgUnits[orgUnitId] = { orgUnitId, policySets };
  }

}
