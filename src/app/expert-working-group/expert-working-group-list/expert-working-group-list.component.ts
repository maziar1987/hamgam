import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { LoggerService } from 'src/app/app-shared/services/logger.service';
import { utils } from '../../app-shared/utils';
import { ExpertWorkingGroup } from '../models';
import { ExpertWorkingGroupService } from '../services';

@Component({
  selector: 'app-expert-working-group-list',
  templateUrl: './expert-working-group-list.component.html',
  styleUrls: ['./expert-working-group-list.component.scss']
})
export class ExpertWorkingGroupListComponent extends BaseComponent implements OnInit {

  @ViewChild('accept_modal') accept_modal: AcceptComponent;

  cols: any[];
  loading: boolean;

  expertWorkingGroups: ExpertWorkingGroup[];
  selectedExpertWorkingGroup: ExpertWorkingGroup;
  utils: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private logger: LoggerService,
    private service: ExpertWorkingGroupService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.setColumns();
    this.utils = utils;
  }

  loadData() {
    this.loading = true;
    this.userService.getCurrentUser().subscribe(currentUser => {
      this.currentUser = currentUser;

      this.service.getExpertWorkingGroups().subscribe(expertWorkingGroups => {
        this.loading = false;
        this.expertWorkingGroups = expertWorkingGroups;
        this.setMemberCount();
        this.orgUnitService.getOrgUnits(expertWorkingGroups.map(x => x.categoryId)).subscribe(orgs => {
          this.expertWorkingGroups = expertWorkingGroups.map(x => {
            x.category = orgs.find(y => y.id == x.categoryId);
            return x;
          });
        }, error => {
          this.loading = false;
          this.handleError(error);
        });
      }, error => {
        this.loading = false;
        this.handleError(error);
      });


    }, error => {
      this.loading = false;
      console.error(error);
    });
  }

  setMemberCount() {
    this.expertWorkingGroups.forEach(groups => {
      const appointment = groups.expertAppointments.filter(x => x.endDate === null || new Date(x.endDate) > new Date());
      groups.memberCount = appointment.length;
    });
  }

  setColumns() {
    this.translate.get('expertWorkingGroup').subscribe(res => {
      this.cols = [
        { field: 'category', header: res.category },
        { field: 'lastEditDate', header: res.lastEditDate },
        { field: 'memberCount', header: res.memberCount }
      ];
    });
  }

  items = <MenuItem[]>[];

  getMenuItems(rowNode: ExpertWorkingGroup): MenuItem[] {

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
      }
    );
    this.items = items;
    return items;
  }

  onRowSelect(event) {
    // this.selectedBasicInfos = event;
  }

  onView(rowNode) {
    this.router.navigate(['./', rowNode.id], { relativeTo: this.activatedRoute });
  }

  onCreate() {
    this.router.navigate(['./', 'create'], { relativeTo: this.activatedRoute });
  }

  onEdit(rowNode: ExpertWorkingGroup) {
    this.router.navigate(['./', 'edit', rowNode.id], { relativeTo: this.activatedRoute });
  }

  onDelete(rowNode: ExpertWorkingGroup) {
    this.accept_modal.show(rowNode.title + ' حذف شود؟', rowNode);
  }

  delete(rowData) {
    this.service.deleteExpertWorkingGroup(rowData.id).subscribe(res => {
      this.successNotify({ detail: 'عملیات حذف با موفقیت انجام شد.', summary: 'عملیات موفق' });

      this.expertWorkingGroups = this.expertWorkingGroups.filter(x => x.id !== rowData.id);
    }, error => {
      this.errorNotify();
      this.handleError(error);
    });
  }

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      this.logger.error(error);
    }
  }

}
