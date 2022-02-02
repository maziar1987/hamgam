import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { OrgUnit } from '../models/org-unit';
import { OrgUnitService } from '../services/org-unit.service';

@Component({
  selector: 'app-org-unit-edit',
  templateUrl: './org-unit-edit.component.html',
  styleUrls: ['./org-unit-edit.component.scss'],
})
export class OrgUnitEditComponent extends BaseComponent implements OnInit {

  filter = true;
  editMode = false;
  orgUnit: OrgUnit;
  display = true;
  parentId: number;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: OrgUnitService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    if (this.config.data.parentId) {
      this.parentId = +this.config.data.parentId;
    }
  }

  get displayName() {
    return this.form.get('displayName');
  }

  get code() {
    return this.form.get('code');
  }

  get activated() {
    return this.form.get('activated');
  }

  get viewOrder() {
    return this.form.get('viewOrder');
  }

  createForm() {
    this.form = this.fb.group({
      displayName: ['', [Validators.required]],
      code: [''],
      viewOrder: [null],
      activated: [true, [Validators.required]]
    });
  }

  updateForm() {
    this.form.controls.displayName.setValue(this.orgUnit?.displayName);
    this.form.controls.code.setValue(this.orgUnit?.code);
    this.form.controls.activated.setValue(this.orgUnit?.activated);
  }

  onBack() {
    this.ref.close(null);
  }

  handleError(error: any) {
    console.error(error);
    this.errorNotify({ detail: 'خطای نا مشخص', summary: 'رخداد خطا' });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const orgUnitTemp = {
      displayName: this.displayName?.value,
      code: this.code.value,
      activated: this.activated.value,
      viewOrder: this.viewOrder.value,
      parentId: this.parentId
    } as OrgUnit;
    this.service.post(orgUnitTemp).subscribe(res => {
      this.successNotify({ detail: 'ثبت انجام شد', summary: 'عملیات موفق' });
      this.ref.close(res);
    }, error => {
      this.handleError(error);
    });
  }

}
