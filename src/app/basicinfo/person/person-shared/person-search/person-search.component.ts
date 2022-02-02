import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { Pagination } from 'src/app/app-shared/base/pagination.model';
import { utils } from '../../../../app-shared/utils';
import { Person } from '../../models/person';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-person-search',
  templateUrl: './person-search.component.html',
  styleUrls: ['./person-search.component.scss']
})
export class PersonSearchComponent extends BaseComponent implements OnInit {

  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();

  @Output() select: EventEmitter<Person> = new EventEmitter();
  searchValue: string;

  people: Person[];
  selectedPeople: Person;
  loading: boolean;
  cols: any[];

  page = 0;
  rows = 10;
  first = 0;
  totalRecords = 0;
  utils: any;

  constructor(private personService: PersonService) {
    super();
  }

  ngOnInit(): void {
    this.setTotalRecords();
    this.loadData();
    this.setColumns();
    this.utils = utils;
  }

  setTotalRecords() {
    this.personService.getPeopleCount().subscribe(count => {
      this.totalRecords = count;
    }, error => {
      console.error(error);
    });
  }

  get pagination(): Pagination {
    return { page: this.page, size: this.rows };
  }

  loadData() {
    this.personService.getPeople(this.pagination).subscribe(res => {
      this.people = res;
    }, error => {
      console.error(error);
    });
  }

  setColumns() {
    this.translate.get('expertPerson').subscribe(res => {
      this.cols = [
        { field: 'lastName', header: res.lastName },
        { field: 'firstName', header: res.firstName },
        { field: 'fatherName', header: res.fatherName },
        { field: 'personnelCode', header: res.personnelCode },
        { field: 'nationalCode', header: res.nationalCode },
        { field: 'organizationName', header: res.serviceLocation }
      ];
    });
  }

  onRowSelect(event) {
    // this.selectedBasicInfos = event;
  }

  onSearch() {
    this.personService.searchPeople({ value: this.searchValue }, this.pagination).subscribe(res => {
      this.people = res.content;
      this.totalRecords = res.totalElements;
      console.log(res);
    }, error => {
      console.error(error);
    });
  }

  onRefresh() {
    this.searchValue = null;
    this.rows = 10;
    this.page = 0;
    this.setTotalRecords();
    this.loadData();
  }

  onSelect(rowData) {
    this.select.emit(rowData);
    this.onBack();
  }

  onBack() {
    this.visible = false;
  }

  onHide() {
    this.visibleChange.emit(false);
  }

  onPageChange(event) {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.page = event.page;
    this.rows = event.rows;
    if (this.searchValue) {
      this.onSearch();
    } else {
      this.loadData();
    }
  }

}
