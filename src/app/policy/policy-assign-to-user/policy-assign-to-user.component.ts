import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { utils } from '../../app-shared/utils';
import { PolicySet } from '../models/policy.model';
import { UserPolicySets } from '../models/user-policy-sets';
import { UserModel } from '../models/user.model';
import { PolicySetService } from '../services/policy-set.service';

@Component({
  selector: 'app-policy-assign-to-user',
  templateUrl: './policy-assign-to-user.component.html',
  styleUrls: ['./policy-assign-to-user.component.scss']
})
export class PolicyAssignToUserComponent extends BaseComponent implements OnInit, OnChanges {
  users: UserModel[] = [];
  policySets: PolicySet[] = [];

  cols: any[];
  userCols: any[];
  loading: boolean;
  utils: any;

  selectedUser: UserModel;
  selectedUserId: number;
  curUserPolicySets: UserPolicySets = new UserPolicySets();
  serverUserPolicySets: PolicySet[] = [];

  changedUsers: { [userId: number]: UserPolicySets; } = {};

  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private policyService: PolicySetService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadData();
  }

  ngOnInit(): void {
    this.setCols();
    this.loadData();
    this.loadUsers();
    this.utils = utils;
  }

  loadData() {
    this.policyService.getPolicySets().subscribe(result => {
      this.policySets = result;
    }, error => {
      console.error(error);
    });
  }

  loadUsers() {
    this.policyService.getUserList().subscribe(users => {
      this.users = users;
      this.selectedUser = this.users[0];
      this.policyService.getPolicySets().subscribe(result => {
        this.policySets = result;
        this.curUserPolicySets.policySets= this.policySets.filter(x => x.usersIds.includes(this.selectedUser.id));
      });
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

    this.translate.get('user').subscribe(userTrans => {
      this.userCols = [
        { field: 'firstName', header: userTrans.firstName },
        { field: 'lastName', header: userTrans.lastName },
        { field: 'login', header: userTrans.login }
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
    if (this.selectionChanged(this.serverUserPolicySets, this.curUserPolicySets.policySets)) {
      this.rememberUser(this.selectedUserId, this.curUserPolicySets.policySets);
    }

    const usersPolicySets: UserPolicySets[] = [];

    for (const key in this.changedUsers)
      usersPolicySets.push(this.changedUsers[key]);

    this.policyService.updateUsersPolicySets(usersPolicySets).subscribe(() => {
      this.visible = false;
      this.visibleChange.emit(false);
    }, error => {
      console.error(error);
    });
  }


  onUserRowSelect($event: any) {
    if (!$event.id) return;

    if (this.selectedUserId && this.selectionChanged(this.serverUserPolicySets, this.curUserPolicySets.policySets)) {
      this.rememberUser(this.selectedUserId, this.curUserPolicySets.policySets);
    }

    this.selectedUserId = $event.id;

    this.serverUserPolicySets = this.policySets.filter(x => x.usersIds.includes(this.selectedUserId));
    this.curUserPolicySets.policySets = this.serverUserPolicySets;
  }

  selectionChanged(prevPolicySets: PolicySet[], newPolicySets: PolicySet[]): boolean {
    const addList = newPolicySets.filter(x => !prevPolicySets.includes(x));
    const removeList = prevPolicySets.filter(x => !newPolicySets.includes(x));

    if (addList.length === 0 && removeList.length === 0) {
      return false;
    }

    addList.forEach(x => {
      x.usersIds.push(this.selectedUserId);
    });

    removeList.forEach(x => {
      x.usersIds = x.usersIds.filter(y => y !== this.selectedUserId);
    });

    return true;
  }

  rememberUser(userId: number, policySets: PolicySet[]) {
    this.changedUsers[userId] = { userId, policySets };
  }

  onPage(event: any) {
    if (!this.selectedUserId) return;

    if (this.selectedUserId && this.selectionChanged(this.serverUserPolicySets, this.curUserPolicySets.policySets)) {
      this.rememberUser(this.selectedUserId, this.curUserPolicySets.policySets);
    }

    this.selectedUserId = null;

    this.serverUserPolicySets = [];
    this.curUserPolicySets.policySets = this.serverUserPolicySets;
  }

}
