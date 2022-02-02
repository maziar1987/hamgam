import {Component, OnInit} from '@angular/core';
import {FormContainerChildBaseComponent} from '../../../../form-container/models/form-container-child-base-component';
import {CertificateStatus, CertificateStatusList} from '../certificate-status/certificate-status.model';
import {CertificateStatusService} from '../certificate-status/certificate-status.service';
import {ExpertPerson} from '../../../../expert-person/expert-person.model';
import {MenuItem} from 'primeng/api';
import {HttpErrorResponse} from '@angular/common/http';
import {LoggerService} from '../../../../app-shared/services/logger.service';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {stringify} from 'querystring';
import {BasicValueService} from '../../../../basicinfo/basic-value/basic-value.service';
import {CertificateStatusComponent} from '../certificate-status/certificate-status.component';
import {ActivatedRoute, Router} from '@angular/router';
import {BasicValue, BasicValueType} from '../../../../basicinfo/basic-value/basic-value.model';

@Component({
  selector: 'app-certificate-status-list',
  templateUrl: './certificate-status-list.component.html',
  styleUrls: ['./certificate-status-list.component.scss']
})
export class CertificateStatusListComponent extends FormContainerChildBaseComponent implements OnInit {

  statusList: CertificateStatusList[] = [];
  selectedStatusList: CertificateStatusList;
  certificateId: number;
  cols: any;
  loading: boolean;
  ref: DynamicDialogRef;

  constructor(
    private statusService: CertificateStatusService,
    private logger: LoggerService,
    private basicValueService: BasicValueService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.setColumns();
  }

  loadData() {
    this.route.params.subscribe(params => {
      if (Object.keys(params).length !== 0) {
        this.statusService.loadData(params.id).subscribe(statusList => {
          this.certificateId = params.id;
          this.basicValueService.getBasicInfo(BasicValueType.regulationStatus).subscribe(basicValue => {
            statusList.forEach(list => {
              this.statusList.push({
                id: list.id,
                statusDesc: basicValue.children.find(x => x.id === list.statusId).title,
                startData: list.startDate,
                endDate: list.endDate,
                description: list.description
              });
            });
          });
        });
      }
    });
  }

  setColumns() {
    this.translate.get('regulations.certificate.certificateList').subscribe(res => {
      this.cols = [
        {field: 'statusDesc', header: res.statusDesc},
        {field: 'startDate', header: res.startDate},
        {field: 'endDate', header: res.endDate},
        {field: 'description', header: res.description},
      ];
    });
  }

  getMenuItems(certificateStatus: CertificateStatus): MenuItem[] {
    let action: any;
    this.translate.get('action').subscribe(res => {
      action = res;
    });
    const items = [] as MenuItem[];
    items.push(
      {
        label: action.view, icon: 'pi pi-info', command: () => {
          this.onView(certificateStatus);
        }
      });

    return items;
  }

  onView(certificateStatus: CertificateStatus) {
    this.ref = this.dialogService.open(CertificateStatusComponent, {
      data: {id: certificateStatus.id, readOnly: true},
      width: '70%',
      contentStyle: {'max-height': '650px', overflow: 'auto', direction: 'rtl', 'text-align': 'right'}
    });
  }

  handleError(error: any, id?: number) {

    if (error instanceof HttpErrorResponse) {

      this.logger.error(error);
    }
  }

  onBack() {
    this.router.navigateByUrl('regulations/add-edit/certificate/' + this.certificateId);
  }

}
