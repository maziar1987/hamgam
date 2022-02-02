import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { LoggerService } from 'src/app/app-shared/services/logger.service';
import { BasicValue, BasicValueConsts, basicValueSortTypeEnum, basicValueStatusEnum, BasicValueUpdate } from '../basic-value.model';
import { BasicValueService } from '../basic-value.service';

@Component({
  selector: 'app-basic-value-edit',
  templateUrl: './basic-value-edit.component.html',
  styleUrls: ['./basic-value-edit.component.scss']
})
export class BasicValueEditComponent extends BaseComponent implements OnInit {

  pageTitle: string;
  basicInfo: BasicValue;

  basicStatus = basicValueStatusEnum;

  basicSort = basicValueSortTypeEnum;
  basic: BasicValue;
  constructor(

    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private logger: LoggerService,
    private service: BasicValueService) {

    super();


  }

  ngOnInit(): void {
    this.pageTitle = "ویرایش"

    // create an empty object
    this.basicInfo = <BasicValue>{};

    // initialize the form
    this.createForm();
    if (this.config.data.id)
      var id: number = +this.config.data.id;

    // var id: number = +this.activatedRoute.snapshot.params["id"];

    // fetch the value from the service
    // this.service.getBasicInfoWithChildren(id).subscribe(res => {
    this.service.getBasicInfo(id).subscribe(res => {
      this.basicInfo = res;
      if (this.basicInfo.readonly) {
        this.onBack();
      }

      this.pageTitle = "ویرایش - " + this.basicInfo.title;

      // update the form with the value
      this.updateForm();

    }, error => {
      this.handleError(error);
    });
  }

  createForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(BasicValueConsts.ValueMaxLength)]],
      code: ['', [Validators.required, Validators.maxLength(BasicValueConsts.ValueMaxLength)]],
      status: ['', [Validators.required]],
      viewOrder: ['', [Validators.required]],
      sortType: ['', [Validators.required]],
      // readonly: true
    });
  }

  get title() { return this.form.get('title'); }
  get code() { return this.form.get('code'); }
  get status() { return this.form.get('status'); }
  get viewOrder() { return this.form.get('viewOrder'); }
  get sortType() { return this.form.get('sortType'); }
  // get readonly() { return this.form.get('readonly'); }

  updateForm() {
    this.title.setValue(this.basicInfo.title);
    this.code.setValue(this.basicInfo.code);
    var kk = basicValueStatusEnum[basicValueStatusEnum.ACTIVE];
    if (this.basicInfo.status.toString() == kk.toString()) {
      this.status.setValue(true);
    } else {
      this.status.setValue(false);
    }
    this.viewOrder.setValue(this.basicInfo.viewOrder);
    this.sortType.setValue(basicValueSortTypeEnum[this.basicInfo.sortType]);
    // this.readonly.setValue(this.basicInfo.readonly);
  }

  onSubmit() {
    if (this.basicInfo.readonly) {
      this.warningNotify({ detail: 'امکان ویرایش وجود ندارد', summary: "اخطار" });
    }

    if (this.form.valid) {
      var statusTemp = basicValueStatusEnum[basicValueStatusEnum.ACTIVE];
      if (this.status.value == false) {
        statusTemp = basicValueStatusEnum[basicValueStatusEnum.INACTIVE]
      }
      var bi = <BasicValueUpdate>{
        id: this.basicInfo.id,
        title: this.title.value,
        code: this.code.value,
        status: statusTemp,
        viewOrder: this.viewOrder.value,
        sortType: basicValueSortTypeEnum[this.sortType.value],
        // readonly: this.form.value.readonly,
        parentId: this.basicInfo.parentId
      }

      if (this.validated(bi)) {
        this.service.put(bi).subscribe(res => {

          this.logger.log("BasicInfo has been updated: ", res);
          this.successNotify({ detail: "ویرایش با موفقیت انجام شد.", summary: "عملیات موفق" });
          this.basic = res;
          this.onBack();
        }, error => {
          this.warningNotify({ detail: "ویرایش انجام نشد.", summary: "اخطار" });
          this.handleError(error);
        });
      }
    } else {
      this.title.markAsTouched();
    }
  }

  handleError(error: any, id?: number) {

    this.logger.error(error);

    if (error instanceof HttpErrorResponse) {
      if (error.error?.error?.validationErrors) {

        error.error?.error?.validationErrors.forEach(err => {

          console.log('error message: ', err.message);
          if (err.message == 'required') {
            this.title.setErrors({ 'required': true });
          }
          if (err.message == 'maxLength') {
            this.title.setErrors({ 'maxLength': true });
          }
        });
      }
    }
  }

  validated(basicInfo: BasicValueUpdate): boolean {
    if (this.basicInfo.children) {
      var existsChild = this.basicInfo.children.find(x => x.title == basicInfo.title);
      if (existsChild) {
        this.title.setErrors({ 'childValueDuplicated': true });
        this.warningNotify({ detail: 'مقدار تکراری می باشد', summary: "اخطار" });
        return false;
      }
    }

    return true;
  }

  onBack() {
    this.ref.close(this.basic);
  }

}
