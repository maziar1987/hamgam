import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng';
import { FormContainerChildBaseComponent } from 'src/app/form-container/models/form-container-child-base-component';
import { TeamModal } from '../../specialized-team/specialized-team.model';

@Component({
  selector: 'app-add-supervision-edit',
  templateUrl: './add-supervision-edit.component.html',
  styleUrls: ['./add-supervision-edit.component.scss']
})
export class AddSupervisionEditComponent extends FormContainerChildBaseComponent implements OnInit {
  itemEdit: TeamModal;
  placement = 'bottom';
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private fb: FormBuilder) { super(); }

  ngOnInit(): void {
    this.form = this.fb.group({
      startDate: [null, [Validators.required]],
      endDate: [null]
    });
    this.itemEdit = this.config.data.itemEdit;
    this.form.controls.startDate.setValue(this.itemEdit.startDate);
    this.form.controls.endDate.setValue(this.itemEdit.endDate);
  }
  onSubmit() {
    if (this.form.invalid) {
      return;
    }    
    let res = {
      expertPerson: this.itemEdit.expertPerson,
      expertPersonId: this.itemEdit.expertPersonId,
      responsibilityId: this.itemEdit.responsibilityId,
      responsibilityCode: this.itemEdit.responsibilityCode,
      responsibility: this.itemEdit.responsibility,
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
  get startDate() { return this.form.get('startDate'); }
  get endDate() { return this.form.get('endDate'); }


}
