import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { Pagination } from 'src/app/app-shared/base/pagination.model';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { utils } from '../../app-shared/utils';
import { User } from '../models/user';
import { UserManagementService } from '../services/user-management.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends BaseComponent implements OnInit {

  isLoading = false;
  @ViewChild('accept_modal') accept_modal: AcceptComponent;
  utils: any;
  cols: any[];
  loading: boolean;

  users: User[] = [];
  selectedUser: User;

  page: number = 0;
  rows: number = 10;
  first: number = 0;
  totalRecords: number = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userManagementService: UserManagementService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.setColumns();
    this.utils = utils;
  }

  get pagination(): Pagination {
    return { page: this.page, size: this.rows };
  }

  loadData() {
    this.isLoading = true;
    this.userManagementService.getUsers(this.pagination).subscribe(res => {
      res.content.sort((a, b) => a.lastModifiedDate < b.lastModifiedDate ? 1 : -1);
      this.users = res.content;
      this.totalRecords = res.totalElements;
    }, error => {
      this.handleError(error);
      this.errorNotify({ detail: 'خطا در دریافت اطلاعات کاربران', summary: 'رخداد خطا' });
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  setColumns() {
    this.translate.get('user').subscribe(res => {
      this.cols = [
        { field: 'lastName', header: res.lastName },
        { field: 'firstName', header: res.firstName },
        { field: 'login', header: res.login },
        // { field: 'email', header: res.email },
        { field: 'activated', header: res.activated },
        // { field: 'langKey', header: res.langKey.langKey },
        // { field: 'policySets', header: res.policySets },
        { field: 'createdDate', header: res.createdDate },
        { field: 'lastModifiedBy', header: res.lastModifiedBy },
        { field: 'lastModifiedDate', header: res.lastModifiedDate }
      ];
    });
  }

  getMenuItems(rowNode: User): MenuItem[] {

    var action: any;
    this.translate.get('action').subscribe(res => {
      action = res;
    });

    var items = <MenuItem[]>[];
    items.push(
      {
        label: action.view, icon: 'pi pi-info', command: () => {
          this.onView(rowNode);
        }
      });

    items.push(
      {
        label: action.edit, icon: 'pi pi-pencil', command: () => {
          this.onEdit(rowNode);
        }
      });

    items.push(
      {
        label: action.delete, icon: 'pi pi-times', command: () => {
          this.onDelete(rowNode);
        }
      });

    return items;
  }

  onView(rowNode: User) {
    this.router.navigate(["./", rowNode.id], { relativeTo: this.activatedRoute });
  }

  onCreate() {
    this.router.navigate(["./", "create"], { relativeTo: this.activatedRoute });
  }

  onEdit(rowNode: User) {
    this.router.navigate(["./", "edit", rowNode.id], { relativeTo: this.activatedRoute });
  }

  onDelete(rowNode: User) {
    this.accept_modal.show(rowNode.login + ' حذف شود؟', rowNode);
  }

  delete(rowData: User) {
    this.userManagementService.deleteUser(rowData.login).subscribe(res => {
      this.successNotify({ detail: 'عملیات حذف با موفقیت انجام شد', summary: 'عملیات موفق' });

      this.users = this.users.filter(x => x.id !== rowData.id);
    }, error => {
      this.handleError(error);
    });
  }

  handleError(error: any) {
    console.error(error);
  }

  onPageChange(event) {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.page = event.page;
    this.rows = event.rows;
    // if (this.searchValue?.trim()) {
    //   this.onSearch();
    // } else {
    this.loadData();
    // }
  }

}
