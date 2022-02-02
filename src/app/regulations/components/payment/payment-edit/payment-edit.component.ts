import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppFileManagerService } from 'src/app/app-file-manager/app-file-manager.service';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { PaymentDTO, PaymentTable } from '../paymant.model';
import { PaymentService } from '../payment.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-edit',
  templateUrl: './payment-edit.component.html',
  styleUrls: ['./payment-edit.component.scss']
})
export class PaymentEditComponent extends BaseComponent implements OnInit {
  paymentInit: PaymentTable;
  attachmentFile: any;
  attachmentId: number;
  editMode = false;
  loading: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    public appFileManager: AppFileManagerService,
    private fb: FormBuilder,
    private location: Location
  ) { super() }
  placement = 'bottom';
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(p => {
      this.paymentInit = JSON.parse(p.get('data'));
      if (this.paymentInit.id > 0) {
        this.loadData();
      }
    });
    this.form = this.fb.group({
      paymentDate: [null, [Validators.required]],
      file: ['', [Validators.required]],
      description: ['']
    });
  }
  loadData() {
    this.editMode = true;
    this.loading = true;
    this.paymentService.getPaymentById(this.paymentInit.id).subscribe(async res => {
      this.description.setValue(res.description);
      this.paymentDate.setValue(res.paymentDate);
      this.loading = false;
      if (res.fileId) {
        const attachmentFileData = `data:${res.file.dataContentType};base64,` + res.file.data;
        this.attachmentFile = await this.appFileManager.convertToFile(attachmentFileData, res.file);
        this.file.setValue(this.attachmentFile);
      }
      this.attachmentId = res.fileId;
    });
  }
  onUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.file.setValue(event.target.files[0]);
      this.attachmentFile = event.target.files[0];
      if (this.editMode) { this.attachmentId = null; }
    }
    event.srcElement.value = null;


  }

  onRemoveUpload() {
    this.attachmentFile = null;
    this.file.setValue(null);
    if (this.editMode) { this.attachmentId = null; }
  }
  onBack() { this.location.back(); }
  onSubmit() {
    const PaymentDTO = {
      certificateId: this.paymentInit.certificateId,
      teamMemberId: this.paymentInit.teamMemberId,
      paymentDate: this.paymentDate.value,
      description: this.description.value,
      paymentAmount: this.paymentInit.amount,
      paymentStep: this.paymentInit.stepNumber,
      paymentPercent: this.paymentInit.stepPercent,
      paymentMethodId: this.paymentInit.paymentMethodId
    } as PaymentDTO;

    if (this.editMode) {
      PaymentDTO.id = this.paymentInit.id;
      PaymentDTO.fileId = this.attachmentId;
      this.paymentService.update(PaymentDTO, this.attachmentFile).subscribe(res => {
        this.successNotify({ summary: 'عملیات موفق', detail: 'تغییرات ذخیره گردید' });
        this.location.back();
      }, error => {
        this.errorNotify({ summary: 'عملیات ناموفق', detail: 'خطا هنگام ویرایش' });
      });
    } else {
      this.paymentService.save(PaymentDTO, this.attachmentFile).subscribe(res => {
        this.successNotify({ summary: 'عملیات موفق', detail: 'ثبت با موفقیت انجام شد' });
        this.location.back();
      }, error => {
        this.errorNotify({ summary: 'عملیات ناموفق', detail: 'خطا هنگام ثبت' });
      });
    }
  }
  get paymentDate() { return this.form.get('paymentDate'); }
  get file() { return this.form.get('file'); }
  get description() { return this.form.get('description'); }

}
