import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { Pagination } from 'src/app/app-shared/base/pagination.model';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { LoggerService } from 'src/app/app-shared/services/logger.service';
import { utils } from '../../../app-shared/utils';
import { Person } from '../../orgunit/person.model';
import { PersonService } from '../services/person.service';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss']
})
export class PersonListComponent extends BaseComponent implements OnInit {

  @ViewChild('accept_modal') accept_modal: AcceptComponent;

  cols: any[];
  loading: boolean = false;
  utils: any;
  people: Person[] = [];
  selectedPerson: Person;

  page: number = 0;
  rows: number = 10;
  first: number = 0;
  totalRecords: number = 0;

  searchValue: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private logger: LoggerService,
    private service: PersonService) {
    super();
  }

  ngOnInit(): void {
    this.setTotalRecords();
    this.loadData();
    this.setColumns();
    this.utils = utils;
  }

  setColumns() {
    this.translate.get('person').subscribe(res => {
      this.cols = [
        { field: 'lastName', header: res.lastName },
        { field: 'firstName', header: res.firstName },
        { field: 'fatherName', header: res.fatherName },
        { field: 'personnelCode', header: res.personnelCode },
        { field: 'nationalCode', header: res.nationalCode }
      ];
    });
  }

  get pagination(): Pagination {
    return { page: this.page, size: this.rows };
  }

  loadData() {
    this.loading = true;
    this.service.getPeople(this.pagination).subscribe(people => {
      this.loading = false;
      this.people = people;
    }, error => {
      this.loading = false;
      this.handleError(error);
    });
  }

  getMenuItems(rowNode: Person): MenuItem[] {

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

  onRowSelect(event) {
    // this.selectedBasicInfos = event;
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
    this.service.deletePerson(rowData.id).subscribe(res => {
      this.successNotify({ detail: 'حذف انجام شد', summary: 'عملیات موفق' });

      this.people = this.people.filter(x => x.id !== rowData.id);
    }, error => {
      this.handleError(error);
    });
  }

  handleError(error: any) {
    console.error(error);
    this.errorNotify({ detail: 'خطای نا مشخص', summary: 'رخداد خطا' });
  }

  onSearch() {
    if (this.searchValue?.trim()) {
      this.loading = true;
      this.service.searchPeople({ value: this.searchValue?.trim() }, this.pagination).subscribe(res => {
        this.loading = false;
        this.people = res.content;
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
    this.setTotalRecords();
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

  setTotalRecords() {
    this.service.getPeopleCount().subscribe(count => {
      this.totalRecords = count;
    }, error => {
      console.error(error);
    });
  }

}
