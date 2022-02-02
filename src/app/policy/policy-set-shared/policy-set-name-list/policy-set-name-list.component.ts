import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PolicySet } from '../../models/policy.model';
import { PolicySetService } from '../../services/policy-set.service';

@Component({
  selector: 'app-policy-set-name-list',
  templateUrl: './policy-set-name-list.component.html',
  styleUrls: ['./policy-set-name-list.component.scss']
})
export class PolicySetNameListComponent implements OnInit {

  @Output() change: EventEmitter<PolicySet> = new EventEmitter<PolicySet>();

  policies: PolicySet[] = [];
  selectedPolicy: PolicySet;

  @Input() filterAdmin: boolean = false;

  constructor(private policySetService: PolicySetService) { }

  ngOnInit(): void {
    this.policySetService.getPolicySets().subscribe(res => {
      this.policies = res
      if (this.filterAdmin) {
        this.policies = this.policies.filter(x => x.id != 1);
      }
      this.selectedPolicy = this.policies[0];
      this.change.emit(this.selectedPolicy);
    }, error => {
      console.error(error);
    });
  }

  policiesChanged(event: any) {
    this.change.emit(this.selectedPolicy);
  }

}
