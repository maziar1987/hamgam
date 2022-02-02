
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { PaymentMethod } from '../model/payment-method';
import { PaymentPercent } from '../model/payment-percent';
import { PaymentService } from '../payment.service';
@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.scss']
})
export class EditPaymentComponent extends BaseComponent implements OnInit {
  editMode: boolean = false;
  paymentMethod: PaymentMethod;
  disabled: boolean = false;
  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private activatedRoute: ActivatedRoute,
    private location: Location) { super(); }

  ngOnInit(): void {
    this.form = this.fb.group({
      methodName: ['', Validators.required],
      description: [''],
      status: [''],
      steps: this.fb.array([this.initStepForm()])
    });
    this.loadData();
  }
  loadData() {
    this.activatedRoute.paramMap.subscribe(p => {
      this.editMode = (this.activatedRoute.snapshot.url[0].path === "edit");
      if (this.editMode) {
        var id = +p.get('id');
        this.paymentService.getById(id).subscribe(res => {
          this.paymentMethod = res;
          this.updateForm();
        });
      }
    });
  }
  updateForm() {
    this.disabled = this.paymentMethod.hasPayment;
    this.description.setValue(this.paymentMethod.description);
    this.methodName.setValue(this.paymentMethod.methodName);
    this.status.setValue(this.paymentMethod.status);
    for (let index = 1; index < this.paymentMethod.stepsNumber; index++) { this.steps.push(this.initStepForm()); }
    let PaymentPercents: PaymentPercent[] = [];
    this.paymentMethod.steps.forEach(i => {
      PaymentPercents.push(<PaymentPercent>{ step: i });
    });
    this.steps.setValue(PaymentPercents);
  }
  initStepForm(): FormGroup {
    return this.fb.group({
      step: ['', Validators.required]
    })
  }
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    let steps: number[] = [];
    (this.form.value.steps as PaymentPercent[]).forEach(x => { steps.push(x.step) });
    const PaymentMethod = {
      id: this.paymentMethod?.id,
      description: this.description.value,
      methodName: this.methodName.value,
      status: (this.status.value == true ? true : false),
      lastEditDate: new Date(),
      stepsNumber: steps.length,
      steps: steps
    } as PaymentMethod;
    if (this.editMode) {
      this.paymentService.update(PaymentMethod).subscribe(res => {
        this.successNotify({ detail: "ویرایش با موفقیت انجام شد", summary: "عملیات موفق" });
        this.location.back();
      }, error => {
        this.errorNotify({ detail: "ویرایش انجام نشد.", summary: "اخطار" });
      });
    } else {
      this.paymentService.save(PaymentMethod).subscribe(res => {
        this.successNotify({ detail: 'ثبت با موفقیت انجام شد', summary: 'عملیات موفق' });
        this.location.back();
      }, error => {
        this.errorNotify({ detail: 'خطا هنگام ذخیره', summary: 'رخداد خطا' });
      });
    }
  }
  addNewStep(event) {
    event.preventDefault();
    this.steps.push(this.initStepForm());
  }

  removeStep(event, index) {
    event.preventDefault();
    this.steps.removeAt(index);
  }
  onBack() {
    this.location.back();
  }
  get sumd() {
    let sum = 0;
    (this.form.value.steps as PaymentPercent[]).forEach(x => { sum += x.step });
    return sum;
  }
  get sumv() {
    if (this.sumd === 100 && this.form.valid) {
      return false
    } else {
      return true
    }
  }
  get methodName() {
    return this.form.get('methodName');
  }
  get description() {
    return this.form.get('description');
  }
  get status() {
    return this.form.get('status');
  }
  get steps() {
    return this.form.get("steps") as FormArray;
  }
}
