import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { OrgUnit } from '../models/org-unit';

@Component({
  selector: 'app-org-unit-detail',
  templateUrl: './org-unit-detail.component.html',
  styleUrls: ['./org-unit-detail.component.scss']
})
export class OrgUnitDetailComponent extends BaseComponent implements OnInit {

  orgUnit: OrgUnit;
  @ViewChild('accept_modal') accept_modal: AcceptComponent;

  display: boolean = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.activatedRoute.paramMap.subscribe(p => {
      var id = +p.get('id');

      this.orgUnitService.getOrgUnit(id).subscribe(res => {
        this.orgUnit = res;
        console.log(this.orgUnit);

        if (!this.orgUnit) {
          this.warningNotify({ detail: 'اطلاعاتی وجود ندارد', summary: 'اخطار' });
          this.onBack();
        }
      }, error => {
        this.handleError(error);
      });
    });
  }

  handleError(error: any) {
    console.error(error);
    this.errorNotify({ detail: 'خطای نا مشخص', summary: 'رخداد خطا' });
  }

  onBack() {
    this.router.navigate(["../"], { relativeTo: this.activatedRoute });
  }

  onDelete() {
    this.accept_modal.show(this.orgUnit.displayName + ' حذف شود؟', this.orgUnit);
  }

  delete(orgunit: OrgUnit) {
    this.orgUnitService.deleteOrgUnit(orgunit?.id).subscribe(res => {
      this.successNotify({ detail: 'حذف انجام شد', summary: 'عملیات موفق' });
      this.orgUnitService.selectedTreeNode.parent.children = this.orgUnitService.selectedTreeNode.parent.children.filter(x => x.data.id != orgunit.id);
      this.onBack();
    }, error => {
      this.handleError(error);
    });
  }

  onEdit() {
    this.router.navigate(["../edit", this.orgUnit?.id], { relativeTo: this.activatedRoute });
  }

}
