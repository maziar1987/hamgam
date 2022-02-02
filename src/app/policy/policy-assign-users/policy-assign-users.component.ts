import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng';
import { PolicySet } from '../models/policy.model';
import { UserModel } from '../models/user.model';
import { PolicySetService } from '../services/policy-set.service';

@Component({
  selector: 'app-policy-assign-users',
  templateUrl: './policy-assign-users.component.html',
  styleUrls: ['./policy-assign-users.component.scss']
})
export class PolicyAssignUsersComponent implements OnInit {
  selectedUser: UserModel[] = [];
  selectPolicySet: PolicySet;
  userSearch: boolean;
  updatePolicySet: PolicySet;
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private policyService: PolicySetService) { }

  ngOnInit(): void {

    this.selectPolicySet = this.config.data.item;
    this.policyService.getUserByPolicyId(this.selectPolicySet.id).subscribe(users => {
      this.selectedUser = users;   
    }, error => {
    });
  }
  addUser() {   
    this.userSearch = true;
  }
  delete(User) {
    let index: number;
    index = this.selectedUser.indexOf(User);
    if (index > -1) {
      this.selectedUser.splice(index, 1);
    }
  }
  submit() {
    this.updatePolicySet = this.selectPolicySet;
    this.updatePolicySet.usersIds = [];
    this.selectedUser.forEach(i => {
      this.updatePolicySet.usersIds.push(i.id);
    });

    this.policyService.policySetsUpdateUsers(this.updatePolicySet.id, this.updatePolicySet.usersIds).subscribe(() => {
      this.ref.close();
    }, error => {
      this.ref.close();
    });
  }
  onBack() {
    this.ref.close();
  }
  selectUser(user: UserModel) {
    if (this.selectedUser.find(x => x.id == user.id) == null) {
      this.selectedUser.push(user);
    }
  }
}
