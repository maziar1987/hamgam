import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { LoggerService } from 'src/app/app-shared/services/logger.service';
import { BasicValue, BasicValueConsts, BasicValueCreate, basicValueSortTypeEnum, basicValueStatusEnum } from '../basic-value.model';
import { BasicValueService } from '../basic-value.service';

@Component({
  selector: 'app-basic-value-create',
  templateUrl: './basic-value-create.component.html',
  styleUrls: ['./basic-value-create.component.scss'],

})
export class BasicValueCreateComponent extends BaseComponent implements OnInit, OnDestroy {

  pageTitle: string;
  parentExists: boolean = false;
  parentId: number | null;

  basicStatus = basicValueStatusEnum;

  basicSort = basicValueSortTypeEnum;

  stayPage: boolean = true;

  checked: boolean = false;


  parentBasicInfo: BasicValue;
  basicValues: BasicValue[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private logger: LoggerService,
    private service: BasicValueService
  ) {

    super();

    // create an empty object

  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
  }

  // ngOnDestroy(): void {
  //   this.onDestroy();
  // }

  ngOnInit(): void {
    this.parentBasicInfo = <BasicValue>{};


    if (this.config.data.id) {
      this.parentId = +this.config.data.id;
    }
    // this.parentId = +this.activatedRoute.snapshot.params["id"];

    if (this.parentId) {
      this.parentExists = true;
    }

    if (this.parentExists) {
      // fetch the value from the service
      this.service.getBasicInfoWithChildren(this.parentId).subscribe(res => {

        this.parentBasicInfo = res;

        this.pageTitle = 'ثبت اطلاعات پایه جدید - ' + this.parentBasicInfo.title;

        // initialize the form
        this.createForm();
      }, error => {
        this.handleError(error);
      });
    } else {
      this.parentExists = false;
      // initialize the form
      this.createForm();
    }
    // this.pageTitle = "ثبت اطلاعات پایه جدید";
    var a = basicValueSortTypeEnum.ALPHABET;
    var b = basicValueSortTypeEnum[basicValueSortTypeEnum.ALPHABET];
  }

  createForm() {
    var max = 0;
    this.parentBasicInfo?.children?.forEach(a => {
      if (max < a.viewOrder) {
        max = a.viewOrder;
      }
    });
    max++;

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(BasicValueConsts.ValueMaxLength)]],
      code: ['', [Validators.required, Validators.maxLength(BasicValueConsts.ValueMaxLength)]],
      status: true,
      // status: ['', [Validators.required]],
      viewOrder: [max, [Validators.required]],
      sortType: [basicValueSortTypeEnum.NONE, [Validators.required]],
      // readonly: true
    });
  }

  get title() {
    return this.form.get('title');
  }

  get code() {
    return this.form.get('code');
  }

  get status() {
    return this.form.get('status');
  }

  get viewOrder() {
    return this.form.get('viewOrder');
  }

  get sortType() {
    return this.form.get('sortType');
  }

  // get readonly() { return this.form.get('readonly'); }

  onSubmit(close: boolean = false) {
    if (this.form.invalid) {
      return;
    }
    var statusTemp = basicValueStatusEnum[basicValueStatusEnum.ACTIVE];
    if (this.status.value == false) {
      statusTemp = basicValueStatusEnum[basicValueStatusEnum.INACTIVE];
    }
    var bi = <BasicValueCreate>{
      title: this.title.value,
      code: this.code.value,

      status: statusTemp,
      // status: basicValueStatusEnum[this.status.value],
      viewOrder: this.viewOrder.value,
      // readonly: this.readonly.value,
      sortType: basicValueSortTypeEnum[this.sortType.value],
      parentId: this.parentExists ? this.parentId : null
    };
    if (this.validatChildren(bi)) {
      this.service.post(bi).subscribe(res => {

        this.logger.log('BasicInfo has been created: ', res);

        if (!this.parentBasicInfo.children) {
          this.parentBasicInfo.children = [];
        }

        this.parentBasicInfo.children.push(res);
        this.successNotify({ detail: 'ثبت با موفقیت انجام شد.', summary: 'عملیات موفق' });
        this.basicValues.push(res);
        this.form.reset();
        if (close == true) {
          this.onBack();
        }
      }, error => {
        this.errorNotify({ detail: 'ثبت انجام نشد.', summary: 'رویداد خطا' });
        this.handleError(error);
      });
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

  validatChildren(basicInfo: BasicValueCreate): boolean {
    if (this.parentBasicInfo.children) {
      var existsChild = this.parentBasicInfo.children.find(x => x.title == basicInfo.title);
      if (existsChild) {
        this.title.setErrors({ 'childValueDuplicated': true });
        this.warningNotify({ detail: 'مقدار تکراری می باشد', summary: 'اخطار' });
        return false;
      }
    }

    return true;
  }

  onBack() {
    this.ref.close(this.basicValues);
  }

  saveAndClose() {
    this.onSubmit(true);
  }

  onDestroy() {
    if (this.ref) {
      this.ref.close(this.basicValues);
    }
  }
}
