import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { Pagination } from 'src/app/app-shared/base/pagination.model';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { RegulationCertificateService } from '../../regulations-certificate/regulation-certificate.service';
import { RegulationsCertificate } from '../../regulations-certificate/regulations-certificate.model';
import { SessionPlanning } from '../models';
import { SessionPlanningService } from '../services';

@Component({
  selector: 'app-session-planning-list',
  templateUrl: './session-planning-list.component.html',
  styleUrls: ['./session-planning-list.component.scss']
})
export class SessionPlanningListComponent extends BaseComponent implements OnInit {

  @ViewChild('accept_modal_sp') accept_modal_sp: AcceptComponent;

  actionTranslate: any;
  loading: boolean = false;
  utils: any;
  sessions: SessionPlanning[] = [];
  selectedSessionPlanning: SessionPlanning;

  page: number = 0;
  rows: number = 10;
  first: number = 0;
  totalRecords: number = 0;

  searchValue: string;

  certificateId: number;
  certificate: RegulationsCertificate;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: SessionPlanningService,
    private regulationCertificateService: RegulationCertificateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.translate.get('action').subscribe(res => {
      this.actionTranslate = res;
    });

    this.activatedRoute.paramMap.subscribe(p => {

      this.certificateId = +p.get('id');

      if (!this.certificateId) {
        this.warningNotify({ detail: 'ابتدا باید شناسنامه آیین نامه را ثبت نمایید', summary: 'اخطار' });
        this.router.navigate(['../', 'certificate'], { relativeTo: this.activatedRoute });
        return;
      }

      this.regulationCertificateService.getCertificate(this.certificateId).subscribe(cert => {
        this.certificate = cert;
      }, error => {
        console.error(error);
      });

    });

    this.loadData();
  }

  get pagination(): Pagination { return { page: this.page, size: this.rows }; }
  get certificateTitle() { return this.certificate?.title; }


  getSessionMemberDuties(session: SessionPlanning) {
    var duties: string[] = [];
    session.sessionMemberDuties.forEach(element => {
      duties.push(`${element.targetSpecificationMember?.teamMemberId == null ? element.targetSpecificationMember?.memberName : element.targetSpecificationMember?.teamMember?.expertPerson?.firstName + ' ' + element?.targetSpecificationMember?.teamMember?.expertPerson?.lastName} - ${element.duty}`)
    });
    return duties.join('، ');
  }

  loadData() {
    this.loading = true;
    this.service.getSessionPlannings(this.pagination, this.certificateId).subscribe(res => {
      this.loading = false;
      this.sessions = res.content;
      this.totalRecords = res.totalElements;
    }, error => {
      this.loading = false;
      this.handleError(error);
    });
  }

  getMenuItems(session: SessionPlanning): MenuItem[] {
    return <MenuItem[]>[
      { label: this.actionTranslate.edit, icon: 'pi pi-pencil', command: () => { this.onEdit(session); } },
      { label: this.actionTranslate.delete, icon: 'pi pi-times', command: () => { this.onDelete(session); } }
    ];
  }

  onSearch() {
    if (this.searchValue?.trim()) {
      this.loading = true;
      this.service.searchSessionPlanning(this.searchValue?.trim(), this.certificateId, this.pagination).subscribe(res => {
        this.loading = false;
        this.sessions = res.content;
        this.totalRecords = res.totalElements;
      }, error => {
        this.loading = false;
        console.error(error);
      });
    }
  }

  onCreate() {
    this.router.navigate(["../../", "session-planning-edit", this.certificateId], { relativeTo: this.activatedRoute });
  }

  onEdit(session: SessionPlanning) {
    this.router.navigate(["../../", "session-planning-edit", this.certificateId, { sessionId: session.id }], { relativeTo: this.activatedRoute });
  }

  onDelete(session: SessionPlanning) {
    this.accept_modal_sp.show('جلسه ' + ' حذف شود؟', session);
  }

  delete(session: SessionPlanning) {
    this.service.deleteSessionPlanning(session.id).subscribe(res => {
      this.successNotify({ detail: "عملیات حذف با موفقیت انجام شد", summary: 'عملیات موفق' });

      this.sessions = this.sessions.filter(x => x.id !== session.id);
    }, error => {
      this.handleError(error);
    });
  }

  onRefresh() {
    this.searchValue = null;
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

  handleError(error: any) {
    console.error(error);
    this.errorNotify({ detail: 'خطای نا مشخص', summary: 'رخداد خطا' });
  }

}
