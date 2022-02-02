import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { LoggerService } from 'src/app/app-shared/services/logger.service';
import { Pagination } from '../../app-shared/base/pagination.model';
import { utils } from '../../app-shared/utils';
import { ExpertPerson } from '../expert-person.model';
import { ExpertPersonService } from '../expert-person.service';

@Component({
  selector: 'app-expert-person-list',
  templateUrl: './expert-person-list.component.html',
  styleUrls: ['./expert-person-list.component.scss']
})
export class ExpertPersonListComponent extends BaseComponent implements OnInit {

  @ViewChild('accept_modal') accept_modal: AcceptComponent;
  utils: any;
  cols: any[];
  loading: boolean;

  expertPeople: ExpertPerson[] = [];
  selectedExpertPeople: ExpertPerson;

  page: number = 0;
  rows: number = 10;
  first: number = 0;
  totalRecords: number = 0;
  searchValue: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private logger: LoggerService,
    private service: ExpertPersonService,
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
    this.loading = true;
    this.service.getExpertPeople(this.pagination).subscribe(res => {

      this.loading = false;
      this.expertPeople = res.content;
      this.totalRecords = res.totalElements;
    }, error => {
      this.loading = false;
      this.handleError(error);
      this.errorNotify({ detail: 'خطا در دریافت اطلاعات فرد خبره', summary: 'رخداد خطا' });
    });
  }

  setColumns() {
    this.translate.get('expertPerson').subscribe(res => {
      this.cols = [
        { field: 'nationalCode', header: res.nationalCode },
        { field: 'firstName', header: res.firstName },
        { field: 'lastName', header: res.lastName },
        { field: 'fatherName', header: res.fatherName },
        { field: 'status', header: res.status }
      ];
    });
  }

  getMenuItems(rowNode: ExpertPerson): MenuItem[] {

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

  onView(rowNode) {
    this.router.navigate(["./", rowNode.id], { relativeTo: this.activatedRoute });
  }

  onCreate() {
    this.router.navigate(["./", "create"], { relativeTo: this.activatedRoute });
  }

  onEdit(rowNode) {
    this.router.navigate(["./", "edit", rowNode.id], { relativeTo: this.activatedRoute });
  }

  onDelete(rowNode) {
    this.accept_modal.show(rowNode.firstName + ' ' + rowNode.lastName + ' حذف شود؟', rowNode);
  }

  delete(rowData) {
    this.service.deleteExpertPerson(rowData.id).subscribe(res => {
      this.successNotify({ detail: 'عملیات حذف با موفقیت انجام شد', summary: 'عملیات موفق' });

      this.expertPeople = this.expertPeople.filter(x => x.id !== rowData.id);
    }, error => {
      this.handleError(error);
    });
  }

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      this.logger.error(error);

      if (error.error?.workinggroup == 'hasrelation') {
        this.errorNotify({ detail: 'امکان حذف وجود ندارد! فرد خبره در کارگروه عضو می باشد.', summary: 'رخداد خطا' });
      } else if (error.error?.teammember == 'hasrelation') {
        this.errorNotify({ detail: 'امکان حذف وجود ندارد! فرد خبره در تیم تخصصی عضو می باشد.', summary: 'رخداد خطا' });
      }
    }
  }

  onSearch() {
    if (this.searchValue?.trim()) {
      this.loading = true;
      this.service.searchExpertPeople({ value: this.searchValue?.trim() }, this.pagination).subscribe(res => {
        this.loading = false;
        this.expertPeople = res.content;
        this.totalRecords = res.totalElements;
      }, error => {
        this.loading = false;
        console.error(error);
      });
    }
  }

  onRefresh() {
    this.searchValue = '';
    this.rows = 10;
    this.page = 0;
    this.loadData();
  }

  onPageChange(event) {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.page = event.page;
    this.rows = event.rows;
    if (this.searchValue?.trim()) {
      this.onSearch();
    } else {
      this.loadData();
    }
  }

}
