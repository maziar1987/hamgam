import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppFileManagerService } from '../../../app-file-manager/app-file-manager.service';
import { BaseComponent } from '../../../app-shared/base/base.component';
import { Pagination } from '../../../app-shared/base/pagination.model';
import { AcceptComponent } from '../../../app-shared/components/accept/accept.component';
import { LoggerService } from '../../../app-shared/services/logger.service';
import { utils } from '../../../app-shared/utils';
import { BasicValueService } from '../../../basicinfo/basic-value/basic-value.service';
import { NotifyProgramService } from '../../../notify-program/service/notify-program.service';
import { RegulationsService } from '../../regulations.service';
import { RegulationsCertificate } from '../regulations-certificate/regulations-certificate.model';
import { Regulations } from './regulations.model';

@Component({
  selector: 'app-regulations-list',
  templateUrl: './regulations-list.component.html',
  styleUrls: ['./regulations-list.component.scss'],
})
export class RegulationsListComponent extends BaseComponent implements OnInit {

  @ViewChild('accept_modal') accept_modal: AcceptComponent;

  cols: any[];
  loading: boolean;
  regulations: Regulations[] = [];
  selectedRegulation: Regulations;
  utils: any;

  page = 0;
  rows = 10;
  first = 0;
  totalRecords = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private regulationService: RegulationsService,
    private logger: LoggerService,
    private basicValueService: BasicValueService,
    public appFileManager: AppFileManagerService,
    private notifyProgramService: NotifyProgramService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setTotalCount();
    this.loadData();
    this.setColumns();
    this.utils = utils;
  }

  loadData() {
    this.loading = true;
    this.regulationService.getCertificateList(this.pagination).subscribe(req => {
      this.bindLoadDataToList(req);
    }, error => {
      this.loading = false;
      console.error(error);
    });
  }

  bindLoadDataToList(req: RegulationsCertificate[]) {
    this.regulations = [];
    const orgUnitIds = [...new Set(req.map(({ unitId }) => unitId))];
    const certificateIds = [...new Set(req.map(({ id }) => id))];
    const lastStatuses = req.filter(x => x.lastStatus != null).map(({ lastStatus }) => lastStatus).map(({ statusId }) => statusId);
    const statusIds = [...new Set(lastStatuses)];
    this.orgUnitService.getOrgUnits(orgUnitIds).subscribe(orgUnits => {
      this.basicValueService.getBasicValuesByIds(statusIds).subscribe(basicValues => {
        this.regulations.forEach(cert => {
          basicValues.forEach(basicValue => {
            if (cert.statusId === basicValue.id) {
              cert.status = basicValue.title;
            }
          });
        });
        this.loading = false;
      });
      this.regulations.forEach(cert => {
        orgUnits.forEach(orgUnit => {
          if (cert.unitId === orgUnit.id) {
            cert.unit = orgUnit.displayName;
          }
        });
      });
    });
    this.notifyProgramService.getNotifyByCertificateIds(certificateIds).subscribe(notifyPrograms => {
      this.regulations.forEach(cert => {
        notifyPrograms.forEach(notify => {
          const notifyCertificate = notify.notifyCertificates.find(x => x.certificateId === cert.id);
          if (notify.id === notifyCertificate?.notifyProgramId) {
            cert.notifyProgramYear = notify.programYear;
            cert.notifyLetterNo = notify.letterNo;
            cert.notifyAttachmentId = notify.attachment.id;
          }
        });
      });
    });
    req.forEach(value => {
      this.regulations.push(new Regulations(value.id, value.title, (value.lastStatus != null ? value.lastStatus.statusId : null), null, value.unitId, null, null));
    });
  }

  setColumns() {
    this.translate.get('regulations.regulation').subscribe(res => {
      this.cols = [
        { field: 'title', header: res.title },
        { field: 'unit', header: res.unit },
        { field: 'status', header: res.status },
        { field: 'notifyProgramYear', header: res.notifyProgramYear },
        { field: 'notifyLetterNo', header: res.notifyLetterNo },
        { field: 'creationDate', header: res.creationDate },
        { field: 'notifyAttachment', header: res.notifyAttachment }
      ];
    });
  }

  onCreate() {
    this.router.navigateByUrl('regulations/add-edit');
  }

  getMenuItems(rowNode: Regulations): MenuItem[] {
    let action: any;
    this.translate.get('action').subscribe(res => {
      action = res;
    });

    const items = [] as MenuItem[];
    items.push(
      {
        label: action.edit, icon: 'pi pi-pencil', command: () => {
          this.onEdite(rowNode);
        }
      }, {
      label: action.delete, icon: 'pi pi-times', command: () => {
        this.onDelete(rowNode);
      }
    });

    return items;
  }

  onEdite(rowNode) {
    this.router.navigateByUrl('regulations/add-edit/certificate/' + rowNode.id);
  }

  onDelete(rowNode) {
    this.translate.get('message.delete').subscribe(res => {
      this.accept_modal.show(rowNode.title + res.deleted, rowNode);
    });
  }

  handleError(error: any, id?: number) {

    if (error instanceof HttpErrorResponse) {

      this.logger.error(error);
    }
  }

  delete(event) {
    this.regulationService.deleteCertificate(event.id).subscribe(regular => {
      this.translate.get('message.delete').subscribe(res => {
        this.successNotify({ detail: res.successful.successMessage, summary: res.successful.successful });
        this.regulations = this.regulations.filter(value => value.id !== event.id);
      });
    }, error => {
      this.translate.get('message.delete').subscribe(res => {
        this.errorNotify({ detail: res.unsuccessful.deleteMessage, summary: res.unsuccessful.unsuccessful });
      });
    });
  }

  onPageChange(event) {
    // event.first = Index of the first record
    // event.rows = Number of rows to display in new page
    // event.page = Index of the new page
    // event.pageCount = Total number of pages
    this.page = event.page;
    this.rows = event.rows;
    this.loadData();
  }

  filterGlobal(event) {
    if (event.length >= 3) {
      event = event.replace(/\u0643/g, '\u06A9'); // ک
      event = event.replace(/\u0649/g, '\u064A'); // ی
      event = event.replace(/\u06CC/g, '\u064A'); // ی
      this.regulationService.searchByTitle(event, { page: 0, size: 10, sort: ['title,asc'] }).subscribe(res => {
        this.bindLoadDataToList(res);
        this.loading = false;
      });
      this.regulationService.getCountByTitle(event).subscribe(count => {
        this.totalRecords = count;
      });
    } else if (event.length <= 0) {
      this.loadData();
    }
  }

  downloadAttach(rowNode: Regulations) {
    this.appFileManager.getFile(rowNode.notifyAttachmentId).subscribe(res => {
      this.appFileManager.openFile(res.data, res);
    });
  }

  setTotalCount() {
    this.regulationService.getTotalCount().subscribe(cnt => {
      this.totalRecords = cnt;
    });
  }

  get pagination(): Pagination {
    return { page: this.page, size: this.rows, sort: ['title,asc'] };
  }

}
