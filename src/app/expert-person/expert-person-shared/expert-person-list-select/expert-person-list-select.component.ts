import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { LoggerService } from 'src/app/app-shared/services/logger.service';
import { ExpertPerson } from '../../expert-person.model';
import { ExpertPersonService } from '../../expert-person.service';
import {utils} from '../../../app-shared/utils';

@Component({
  selector: 'app-expert-person-list-select',
  templateUrl: './expert-person-list-select.component.html',
  styleUrls: ['./expert-person-list-select.component.scss']
})
export class ExpertPersonListSelectComponent extends BaseComponent implements OnInit {

  display: boolean;
  @Output() select: EventEmitter<any> = new EventEmitter();
  utils: any;
  cols: any[];
  loading: boolean;

  expertPeople: ExpertPerson[] = [];
  selectedExpertPeople: ExpertPerson;

  constructor(
    private logger: LoggerService,
    private service: ExpertPersonService) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.setColumns();
    this.utils = utils;
  }

  loadData() {
    this.service.getExpertPeopleByStatus({ statusCode: '4' }).subscribe(res => {
      this.expertPeople = res;
    }, error => {
      this.handleError(error);
    });
  }

  setColumns() {
    this.translate.get('expertPerson').subscribe(res => {
      this.cols = [
        { field: 'nationalCode', header: res.nationalCode },
        { field: 'firstName', header: res.firstName },
        { field: 'lastName', header: res.lastName }
      ];
    });
  }

  onRowSelect(event) {
    // this.selectedBasicInfos = event;
  }

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      this.logger.error(error);
    }
  }

  public show() {
    this.display = true;
    this.loadData();
  }

  onAdd() {
    this.select.emit(this.selectedExpertPeople);
    this.onBack();
  }

  onAddRow(rowData) {
    this.select.emit(rowData);
    this.onBack();
  }

  onBack() {
    this.display = false;
  }

}
