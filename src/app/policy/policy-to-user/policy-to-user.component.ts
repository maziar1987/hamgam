import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { PolicySet } from '../models/policy.model';
import { UserPolicySets } from '../models/user-policy-sets';
import { UserModel } from '../models/user.model';
import { PolicySetService } from '../services/policy-set.service';

@Component({
  selector: 'policy-to-user',
  templateUrl: './policy-to-user.component.html',
  styleUrls: ['./policy-to-user.component.scss']
})
export class PolicyToUserComponent extends BaseComponent implements OnInit, OnChanges {

  constructor(private policyService: PolicySetService) { super(); }
  users: UserModel[] = [];
  selectedUser: UserModel[] = [];
  selectedUserTemp: UserModel[] = [];
  updatePolicySet: PolicySet;
  userCols: any[];
  rows: number = 10;
  first: number = 0;
  @Input() visible: boolean;
  @Input() selectPolicySet: PolicySet;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
  changedUsers: { [userId: number]: UserPolicySets; } = {};
  usersPolicySets: UserPolicySets[] = [];

  ngOnInit(): void {
    this.translate.get('user').subscribe(userTrans => {
      this.userCols = [
        { field: 'firstName', header: userTrans.firstName },
        { field: 'lastName', header: userTrans.lastName },
        { field: 'login', header: userTrans.login }
      ];
    });
    this.policyService.getUserList().subscribe(users => {
      this.users = users.content;
    }, error => {

    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.selectedUser = [];
    if (this.selectPolicySet.id) {
      this.policyService.getUserByPolicyId(this.selectPolicySet?.id).subscribe(users => {
        this.selectedUser = users;
      }, error => {
      });
      this.rows = 10;
      this.first = 0;
    }
  }
  submit() {

    this.updatePolicySet = this.selectPolicySet;
    this.updatePolicySet.usersIds = [];
    this.selectedUser.forEach(i => {
      this.updatePolicySet.usersIds.push(i.id);
    });

    this.policyService.policySetsUpdateUsers(this.updatePolicySet.id, this.updatePolicySet.usersIds).subscribe(() => {
      // this.showInfo('ذخیره سازی انجام شد');
      this.visible = false;
      this.visibleChange.emit(false);
    }, error => {
      console.error(error);
    });

  }
  hide() {
    this.visibleChange.emit(false);
  }
  onBack() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
  onUserRowSelect($event: any) {
    if (!$event.id) return;
  }
  delete(User) {
    this.selectedUserTemp = this.selectedUser;
    this.selectedUser = [];
    let index: number;
    index = this.selectedUserTemp.indexOf(User);
    if (index > -1) {
      this.selectedUserTemp.splice(index, 1);
    }
    setTimeout(() => {
      this.selectedUser = this.selectedUserTemp;
    }, 10);

  }

}
