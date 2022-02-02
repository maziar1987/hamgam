import {Component, OnInit, ViewChild} from '@angular/core';
import {FormContainerChildBaseComponent} from '../../form-container/models/form-container-child-base-component';
import {NotifyProgram, NotifyProgramView} from '../model/notify-program.model';
import {MenuItem} from 'primeng/api';
import {AcceptComponent} from '../../app-shared/components/accept/accept.component';
import {ActivatedRoute, Router} from '@angular/router';
import {NotifyProgramService} from '../service/notify-program.service';
import {OrgUnitService} from '../../basicinfo/org-unit/services/org-unit.service';

@Component({
  selector: 'app-notify-program-view',
  templateUrl: './notify-program-view.component.html',
  styleUrls: ['./notify-program-view.component.scss']
})
export class NotifyProgramViewComponent extends FormContainerChildBaseComponent implements OnInit {

  @ViewChild('accept_modal') accept_modal: AcceptComponent;

  notifyPrograms: NotifyProgramView[] = [];
  selectNotify: NotifyProgramView;
  loading: boolean;
  cols: any[];

  page = 0;
  rows = 10;
  first = 0;
  totalRecords = 0;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              public notifyService: NotifyProgramService,
              public orgUnitService: OrgUnitService) {
    super();
  }

  ngOnInit(): void {
    this.setColumns();
    this.loadData();
  }

  loadData() {
    let orgUnitDesc = '';
    this.notifyService.getAllNotify().subscribe(notifies => {
      const orgUnitIds = [...new Set(notifies.map(({orgUnitId}) => orgUnitId))];
      this.orgUnitService.getOrgUnits(orgUnitIds).subscribe(orgUnits => {
        notifies.forEach(value => {
          orgUnitDesc = orgUnits.filter(x => x.id === value.orgUnitId)[0].displayName;
          this.notifyPrograms.push({
            id: value.id,
            orgUnit: orgUnitDesc,
            letterNo: value.letterNo,
            programYear: value.programYear,
            createdDate: value.createdDate
          });
        });
      });
    });
  }

  setColumns() {
    this.translate.get('notify-program').subscribe(res => {
      this.cols = [
        {field: 'orgUnit', header: res.orgUnit},
        {field: 'letterNo', header: res.letterNo},
        {field: 'programYear', header: res.programYear},
        {field: 'createdDate', header: res.createdDate}
      ];
    });
  }

  onCreate() {
    this.router.navigate(['./', 'add-edit'], {relativeTo: this.activatedRoute});
  }

  delete(event) {
    this.notifyService.delete(event.id).subscribe(value => {

    });
  }

  getMenuItems(notifyProgram: NotifyProgramView): MenuItem[] {
    let action: any;
    this.translate.get('action').subscribe(res => {
      action = res;
    });
    const items = [] as MenuItem[];
    items.push(
      {
        label: action.edit, icon: 'pi pi-pencil', command: () => {
          this.onEdite(notifyProgram);
        }
      }, {
        label: action.delete, icon: 'pi pi-times', command: () => {
          this.onDelete(notifyProgram);
        }
      });

    return items;
  }

  onEdite(notifyProgram: NotifyProgramView) {
    this.router.navigate(['./', 'add-edit', notifyProgram.id], {relativeTo: this.activatedRoute});
  }

  onDelete(notifyProgram: NotifyProgramView) {
  }

  filterGlobal(event) {
    if (event.length >= 3) {
      event = event.replace(/\u0643/g, '\u06A9'); // ک
      event = event.replace(/\u0649/g, '\u064A'); // ی
      event = event.replace(/\u06CC/g, '\u064A'); // ی
    } else if (event.length <= 0) {
      // this.loadData();
    }
  }

  onPageChange(event) {
    this.page = event.page;
    this.rows = event.rows;
  }

}
