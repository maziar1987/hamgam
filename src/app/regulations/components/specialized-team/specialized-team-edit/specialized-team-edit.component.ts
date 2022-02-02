import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng';
import { BasicValueDropdownComponent } from 'src/app/basicinfo/basic-value/basic-value-shared/basic-value-dropdown/basic-value-dropdown.component';
import { BasicValue, BasicValueType } from 'src/app/basicinfo/basic-value/basic-value.model';
import { FormContainerChildBaseComponent } from 'src/app/form-container/models/form-container-child-base-component';
import { Responsibility, TeamModal } from '../specialized-team.model';

@Component({
  selector: 'app-specialized-team-edit',
  templateUrl: './specialized-team-edit.component.html',
  styleUrls: ['./specialized-team-edit.component.scss']
})
export class SpecializedTeamEditComponent extends FormContainerChildBaseComponent implements OnInit {
  @ViewChild('responsibilityTeamCombo') responsibilityTeamCombo: BasicValueDropdownComponent;
  itemEdit: TeamModal;
  placement = 'bottom';
  selectedResponsibility: BasicValue;
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private fb: FormBuilder,) { super(); }
  get startDate() { return this.form.get('startDate'); }
  get endDate() { return this.form.get('endDate'); }
  get responsibilityId() { return this.form.get('responsibilityId'); }
  ngOnInit(): void {
    this.form = this.fb.group({
      responsibilityId: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null]
    });
    this.itemEdit = this.config.data.itemEdit;
    this.form.controls.startDate.setValue(this.itemEdit.startDate);
    this.form.controls.endDate.setValue(this.itemEdit.endDate);
    this.form.controls.responsibilityId.setValue(this.itemEdit.responsibility.id);
    setTimeout(()=>{
      this.responsibilityTeamCombo.basicInfoItems.
               find(x=>x.value == this.responsibilityTeamCombo.basicInfoParent.children.
               find(x => x.code == Responsibility.Supervision.toString()).id).disabled = true;
    },1000)
  }

  getBasicValueType(basicValueType: string) {
    return BasicValueType[basicValueType];
  }

  selectBasicValueType(event: BasicValue) {
    this.selectedResponsibility = event;
  }
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    let res = {
      expertPerson: this.itemEdit.expertPerson,
      expertPersonId: this.itemEdit.expertPersonId,
      responsibilityId: this.responsibilityId.value,
      responsibilityCode: (this.selectedResponsibility) ? Number(this.selectedResponsibility.code) : Number(this.itemEdit.responsibilityCode),
      responsibility: (this.selectedResponsibility) ? this.selectedResponsibility : this.itemEdit.responsibility,
      startDate: this.startDate.value,
      endDate: this.endDate.value,
    } as TeamModal;
    if (this.itemEdit.id) {
      res.id = this.itemEdit.id;
      res.edit = true;
    }
    this.ref.close(res);
  }

  onBack() {
    this.ref.close();
  }

}
