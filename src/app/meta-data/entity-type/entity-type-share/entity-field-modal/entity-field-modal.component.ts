import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng';
import { CheckboxModule } from 'primeng/checkbox';
import { Field } from '../../models';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { EntityTypeService } from '../../services/entity-type.service';



@Component({
  selector: 'app-entity-field-modal',
  templateUrl: './entity-field-modal.component.html',
  styleUrls: ['./entity-field-modal.component.scss']
})
export class EntityFieldModalComponent extends BaseComponent implements OnInit {

  @Input() display = false;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Input() headerDisplay: string;
  @Output() AddfieldToTable: EventEmitter<Field> = new EventEmitter();
  @Input() GetFieldFromTable: Field;
  types: SelectItem[];
  field: Field;
  constructor(
    private service: EntityTypeService,
    private fb: FormBuilder,
  ) {
    super();
    this.types = [
      { label: 'رشته', value: 'ُstring' },
      { label: 'عدد', value: 'number' }
    ];
  }

  ngOnInit(): void {
    this.createForm(null);
  }

  onHide() {
    this.displayChange.emit(this.display);
  }

  onShow() {
    if (this.GetFieldFromTable) {
      this.createForm(this.GetFieldFromTable);
    }
  }
  submit() {
    var f = {
      name: this.name.value,
      persianName: this.persianName.value,
      required: this.checkedRequired.value,
      valueType: this.selectedType.value,
      defaultValue: this.defaultValue.value,
      mainValue: this.mainValue.value
    } as unknown as Field;
    // this.service.post(entityTypeTemp).subscribe(res => {
    //   this.notifySuccess('عملیات ثبت با موفقیت انجام شد', 'عملیات موفق')
    //   //   this.msgService.add({ key: 'tl', severity: 'success', summary: 'عملیات موفق', detail: 'ثبت انجام شد' });

    //   this.onBack();
    // }, error => {
    //   this.handleError(error);
    // });

    this.AddfieldToTable.emit(f);
    this.resetDialog();
  }
  onBack() {
    this.resetDialog();
  }

  resetDialog() {
    this.createForm(null)
    this.display = false;
  }

  createForm(fild: Field) {
    if (fild) {
      this.form = this.fb.group({
        name: [fild.name, [Validators.required]],
        persianName: [fild.persianName, [Validators.required]],
        checkedRequired: [fild.required, [Validators.required]],
        selectedType: [fild.valueType, [Validators.required]],
        defaultValue: [fild.defaultValue, [Validators.required]],
        mainValue: [fild.mainValue, [Validators.required]]

      });
    }
    else {
      this.form = this.fb.group({
        name: ['', [Validators.required]],
        persianName: ['', [Validators.required]],
        checkedRequired: ['', [Validators.required]],
        selectedType: ['', [Validators.required]],
        defaultValue: ['', [Validators.required]],
        mainValue: ['', [Validators.required]]

      });
    }
  }
  get name() { return this.form.get('name'); }
  get persianName() { return this.form.get('persianName'); }
  get checkedRequired() { return this.form.get('checkedRequired'); }
  get selectedType() { return this.form.get('selectedType'); }
  get defaultValue() { return this.form.get('defaultValue'); }
  get mainValue() { return this.form.get('mainValue'); }

  updateForm() {
    this.form.controls.name.setValue(this.field.name);
    this.form.controls.persianName.setValue(this.field.persianName);
    this.form.controls.type.setValue(this.field.valueType);
    this.form.controls.required.setValue(this.field.required);
    this.form.controls.mainValue.setValue(this.field.mainValue);
    this.form.controls.defaultValue.setValue(this.field.defaultValue);

  }
}
