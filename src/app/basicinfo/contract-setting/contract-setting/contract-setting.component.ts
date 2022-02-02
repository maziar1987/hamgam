import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '../../../app-shared/base/base.component';
import { ContractSetting } from '../model/contract-setting.model';
import { ContractSettingService } from '../service/contract-setting.service';

@Component({
  selector: 'app-contract-setting',
  templateUrl: './contract-setting.component.html',
  styleUrls: ['./contract-setting.component.scss'],
})
export class ContractSettingComponent extends BaseComponent implements OnInit {

  contract: ContractSetting;

  private _location: Location;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    public service: ContractSettingService) {
    super();
    this._location = location;
  }

  ngOnInit(): void {
    this.createFirm();
    this.loadForm();
  }

  createFirm() {
    this.form = this.fb.group({
      worksheetPrice: [null, Validators.compose([Validators.required])],
      consumableItemsPercentage: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(100)])],
      supervisorPercentage: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(100)])],
      masterPercentage: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(100)])],
    });
  }

  loadForm() {
    this.service.loadData().subscribe(contract => {
      this.contract = contract[0];
      if (!this.contract) {
        this.form.controls.worksheetPrice.setValue(1800000);
      }
      this.updateForm();
    });
  }

  updateForm() {
    this.form.controls.worksheetPrice.setValue(this.contract.worksheetPrice);
    this.form.controls.consumableItemsPercentage.setValue(this.contract.consumableItemsPercentage);
    this.form.controls.supervisorPercentage.setValue(this.contract.supervisorPercentage);
    this.form.controls.masterPercentage.setValue(this.contract.masterPercentage);
  }

  onSubmit() {
    const prop = {
      worksheetPrice: this.worksheetPrice.value,
      consumableItemsPercentage: this.consumableItemsPercentage.value,
      supervisorPercentage: this.supervisorPercentage.value,
      masterPercentage: this.masterPercentage.value
    } as ContractSetting;
    if (!this.contract?.id) {
      this.service.save(prop).subscribe(contract => {
        this.contract = contract;
        this.successNotify({ detail: 'ثبت با موفقیت انجام شد.', summary: 'عملیات موفق' });
      }, error => {
        this.errorNotify({ detail: 'خطا هنگام ذخیره', summary: 'رخداد خطا' });
      });
    } else {
      prop.id = this.contract.id;
      this.service.update(prop).subscribe(contract => {
        this.contract = contract;
        this.infoNotify({ detail: 'تغییرات ذخیره گردید', summary: 'عملیات موفق' });
      }, error => {
        this.errorNotify({ detail: 'خطا هنگام ویرایش', summary: 'رخداد خطا' });
      });
    }
  }

  onBack() {
    this._location.back();
  }

  get worksheetPrice() {
    return this.form.get('worksheetPrice');
  }

  get consumableItemsPercentage() {
    return this.form.get('consumableItemsPercentage');
  }

  get supervisorPercentage() {
    return this.form.get('supervisorPercentage');
  }

  get masterPercentage() {
    return this.form.get('masterPercentage');
  }

}
