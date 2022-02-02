import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, MenuItem } from 'primeng';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { PolicySet } from '../models/policy.model';
import { PolicySetService } from '../services/policy-set.service';

@Component({
  selector: 'app-policy-list',
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.scss']
})
export class PolicyListComponent extends BaseComponent implements OnInit {
  @ViewChild('accept_modal') accept_modal: AcceptComponent;
  displayMaximizable: boolean;
  policies: PolicySet[] = [];
  selectedPolicy: PolicySet;
  cols: any[];
  loading: boolean;
  policyAssignDisplay = false;
  selectedRow: PolicySet = new PolicySet();
  selectBtn: string;
  policyAssignToUserDisplay: boolean;
  policyToUserDisplay: boolean;
  rowPolicySet: PolicySet = new PolicySet();

  constructor(
    private router: Router,
    private policyService: PolicySetService,
    public dialogService: DialogService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.setCols();
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.policyService.getPolicySets().subscribe(policies => {
      this.loading = false;
      policies.sort((a, b) => a.id > b.id ? 1 : -1);
      this.policies = policies;
    }, error => {
      this.loading = false;
      console.error(error);
    });
  }

  setCols() {
    this.translate.get('policy').subscribe(policy => {
      this.cols = [
        { field: 'name', header: policy.name },
        { field: 'active', header: policy.active },
        // { field: 'creator', header: policy.creatorUser },
        { field: 'lastEditor', header: policy.lastModifiedBy },
        { field: 'lastEditDate', header: policy.editDate },
        { field: 'description', header: policy.description }
      ];
    });
  }

  getMenuItems(rowNode: PolicySet): MenuItem[] {
    // if (rowNode.id == 1) {
    //   return [];
    // }

    let action: any;
    this.translate.get('action').subscribe(res => {
      action = res;
    });
    var menuItems: MenuItem[] = [
      {
        label: action.edit,
        icon: 'pi pi-pencil',
        command: () => {
          this.onEdit(rowNode);
        },
        disabled: (rowNode.id == 1)
      },
      {
        label: action.delete,
        icon: 'pi pi-times',
        command: () => {
          this.onDelete(rowNode);
        },
        disabled: !rowNode.deletable
      }
      // ,
      // {
      //   label: "دسترسی به کاربر",
      //   icon: 'fa fa-user-shield',
      //   command: () => {
      //     this.assingToUser(rowNode);
      //   }
      // },
    ];

    return menuItems;
  }


  onEdit(rowNode: any) {
    this.selectBtn = 'edit';
    this.displayMaximizable = true;
    this.selectedRow = rowNode;
    this.router.navigateByUrl('policy/edit/' + rowNode.id);

  }
  assingToUser(rowNode: any) {
    this.rowPolicySet = rowNode;
    this.policyToUserDisplay = true;
  }


  onDelete(rowNode) {
    if (rowNode.id) {
      this.accept_modal.show(rowNode.name + ' حذف شود؟', rowNode);
    } else {
      this.errorNotify({ detail: 'امکان حذف وجود ندارد', summary: 'رخداد خطا' });
    }
  }

  delete(event) {
    if (event.id) {
      this.policyService.deletePolicy(event.id).subscribe(() => {
        this.successNotify({ detail: 'عملیات حذف با موفقیت انجام شد', summary: 'عملیات موفق' });
        this.loadData();
      }, error => {
        this.errorNotify()
      });
    }
  }


  onRowSelect(policy: PolicySet) {

  }

  onAssignPolicy() {
    this.policyAssignDisplay = true;
  }

  onCreate() {
    this.selectBtn = 'add';
    this.displayMaximizable = true;
    this.router.navigateByUrl('policy/create');
  }

  onAssignToUserPolicy() {
    this.policyAssignToUserDisplay = true;
  }
  PolicyAssignUsers(rowData: PolicySet) {
    this.rowPolicySet = rowData;
    this.policyToUserDisplay = true;
    // const ref = this.dialogService.open(PolicyAssignUsersComponent, {
    //   data: {
    //     item: rowData
    //   },
    //   header: "انتساب دسترسی " + rowData.name + " به کاربرها",
    //   closable: true,
    //   width: '45%',
    //   contentStyle: { 'overflow-x': 'hidden', 'direction': 'rtl', 'text-align': 'right' }
    // });
  }
}
