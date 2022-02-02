import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { Pagination } from 'src/app/app-shared/base/pagination.model';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { RegulationCertificateService } from '../../regulations-certificate/regulation-certificate.service';
import { RegulationsCertificate } from '../../regulations-certificate/regulations-certificate.model';
import { TargetSpecification } from '../models/target-specification';
import { TargetSpecificationMember } from '../models/target-specification-member';
import { TargetSpecificationService } from '../services/target-specification.service';

@Component({
  selector: 'app-target-specification-list',
  templateUrl: './target-specification-list.component.html',
  styleUrls: ['./target-specification-list.component.scss']
})
export class TargetSpecificationListComponent extends BaseComponent implements OnInit {

  @ViewChild('accept_modal_ts') accept_modal_ts: AcceptComponent;

  actionTranslate: any;
  loading: boolean = false;
  utils: any;
  targets: TargetSpecification[] = [];
  selectedTargetSpecification: TargetSpecification;

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
    private service: TargetSpecificationService,
    private regulationCertificateService: RegulationCertificateService) {
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

      this.loadData();

    });

  }

  get pagination(): Pagination {
    return { page: this.page, size: this.rows };
  }

  get certificateTitle() {
    return this.certificate?.title;
  }

  getActivityTypesTitle(target: TargetSpecification) {
    return target.activityTypes.map(x => x.title).join(' ،');
  }

  getMembersName(members: TargetSpecificationMember[]) {
    return members.map(x => x.teamMember ? `${x.teamMember.expertPerson.firstName} ${x.teamMember.expertPerson.lastName}` : x.memberName).join(' ، ');
  }

  loadData() {
    this.loading = true;
    this.service.getTargetSpecificationsPages(this.certificateId, this.pagination).subscribe(res => {
      this.loading = false;
      this.targets = res.content;
      this.totalRecords = res.totalElements;
    }, error => {
      this.loading = false;
      this.handleError(error);
    });
  }

  getMenuItems(target: TargetSpecification): MenuItem[] {
    return <MenuItem[]>[
      { label: this.actionTranslate.edit, icon: 'pi pi-pencil', command: () => { this.onEdit(target); } },
      { label: this.actionTranslate.delete, icon: 'pi pi-times', command: () => { this.onDelete(target); } }
    ];
  }

  onSearch() {
    if (this.searchValue?.trim()) {
      this.loading = true;
      this.service.searchTargetSpecification(this.searchValue?.trim(), this.certificateId, this.pagination).subscribe(res => {
        this.loading = false;
        this.targets = res.content;
        this.totalRecords = res.totalElements;
      }, error => {
        this.loading = false;
        console.error(error);
      });
    }
  }

  onCreate() {
    this.router.navigate(["../../", "target-specification-edit", this.certificateId], { relativeTo: this.activatedRoute });
  }

  onEdit(target: TargetSpecification) {
    this.router.navigate(["../../", "target-specification-edit", this.certificateId, { targetId: target.id }], { relativeTo: this.activatedRoute });
  }

  onDelete(target: TargetSpecification) {
    this.accept_modal_ts.show(target.targetTitle + ' ' + ' حذف شود؟', target);
  }

  delete(target) {
    this.service.deleteTargetSpecification(target.id).subscribe(res => {
      this.successNotify({ detail: 'حذف انجام شد', summary: 'عملیات موفق' });

      this.targets = this.targets.filter(x => x.id !== target.id);
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
