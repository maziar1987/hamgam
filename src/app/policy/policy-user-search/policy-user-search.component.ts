import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { UserModel } from '../models/user.model';
import { PolicySetService } from '../services/policy-set.service';

@Component({
  selector: 'policy-user-search',
  templateUrl: './policy-user-search.component.html',
  styleUrls: ['./policy-user-search.component.scss']
})
export class PolicyUserSearchComponent extends BaseComponent implements OnInit {

  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() select: EventEmitter<UserModel> = new EventEmitter();
  users: UserModel[] = [];
  userCols: any[];
  selectedUser: UserModel;
  translate: any;
  constructor(private policyService: PolicySetService) { super(); }

  ngOnInit(): void {
    
    this.loadData();
    this.setCols();
  }
  loadData() {
    this.policyService.getUserList().subscribe(users => {
      this.users = users.content;
    }, error => {

    }); 
  }
  setCols() {
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
  onSelect(rowData) {
    this.select.emit(rowData);
    this.onBack();
  }
  onBack() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

}
