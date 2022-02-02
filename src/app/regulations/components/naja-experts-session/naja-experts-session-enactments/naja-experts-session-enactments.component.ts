import {Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {BaseComponent} from 'src/app/app-shared/base/base.component';
import {NajaExpertsSessionEnactment} from '../models/naja-experts-session-enactment';
import {MenuItem} from 'primeng';

@Component({
  selector: 'app-naja-experts-session-enactments',
  templateUrl: './naja-experts-session-enactments.component.html',
  styleUrls: ['./naja-experts-session-enactments.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NajaExpertsSessionEnactmentsComponent),
      multi: true
    }
  ]
})
export class NajaExpertsSessionEnactmentsComponent extends BaseComponent implements OnInit, ControlValueAccessor {

  enactments: NajaExpertsSessionEnactment[] = [];
  selectedEnactment: NajaExpertsSessionEnactment;

  loading: boolean;
  displayEnactments: boolean = false;
  enactmentsCols: any[];

  isDisabled = false;

  // Function to call when the model changes.
  onChange = (_: any) => {
  };
  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => {
  };

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    this.setColumns();
  }

  writeValue(obj: any): void {
    if (obj) {
      this.enactments = obj;
    } else {
      this.enactments = [];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  setColumns() {
    this.translate.get('regulations.najaExpertsSession').subscribe(res => {
      this.enactmentsCols = [
        {field: 'enactmentTitle', header: res.enactments.enactmentTitle},
        {field: 'enactmentDescription', header: res.enactments.enactmentDescription}
      ];
    });
  }

  onCreate() {
    this.createForm();
    this.displayEnactments = true;
  }

  onEdit(rowData: any) {
    console.log('edit enac', rowData);
    this.updateForm(rowData);
    this.displayEnactments = true;
  }

  onDelete(rowData: any) {
    if (!rowData.id) {
      this.enactments = this.enactments.filter(value =>
        value.enactmentTitle !== rowData.enactmentTitle
      );
    } else {
      this.enactments = this.enactments.filter(value =>
        value.id !== rowData.id
      );
    }

  }

  addNewEnactment() {
    this.displayEnactments = false;
    this.addEnactment(this.form.value);
    this.onChange(this.enactments);
  }

  editEnactment() {
    this.displayEnactments = false;
    this.enactments.forEach(enactment => {
      if (enactment.id === this.form.value.id) {
        enactment.enactmentTitle = this.form.value.enactmentTitle;
        enactment.enactmentDescription = this.form.value.enactmentDescription;
      }
    });
    this.onChange(this.enactments);
  }

  cancel() {
    this.displayEnactments = false;
  }

  get id() {
    return this.form.get('id');
  }

  get enactmentTitle() {
    return this.form.get('enactmentTitle');
  }

  get enactmentDescription() {
    return this.form.get('enactmentDescription');
  }

  createForm() {
    this.form = this.fb.group({
      id: [null],
      enactmentTitle: ['', Validators.required],
      enactmentDescription: [''],
    });
  }

  updateForm(enacment: NajaExpertsSessionEnactment) {
    this.id.setValue(enacment.id);
    this.enactmentTitle.setValue(enacment.enactmentTitle);
    this.enactmentDescription.setValue(enacment.enactmentDescription);
  }

  getMenuItems(rowNode: NajaExpertsSessionEnactment): MenuItem[] {
    var action: any;
    this.translate.get('action').subscribe(res => {
      action = res;
    });

    var items = <MenuItem[]> [];
    items.push(
      {
        label: action.edit, icon: 'pi pi-pencil', command: () => {
          this.onEdit(rowNode);
        }
      });

    items.push(
      {
        label: action.delete, icon: 'pi pi-times', command: () => {
          this.onDelete(rowNode);
        }
      });

    return items;
  }

  addEnactment(enactment: NajaExpertsSessionEnactment): void {
    this.enactments.push(this.createEnactment(enactment));
  }

  createEnactment(enactment: NajaExpertsSessionEnactment): NajaExpertsSessionEnactment {
    return {
      id: enactment.id,
      enactmentDescription: enactment.enactmentDescription,
      enactmentTitle: enactment.enactmentTitle
    } as NajaExpertsSessionEnactment;
  }

  onRowSelect(event: any) {
    this.updateForm(event.data);
  }

  onRowUnselect(event) {
    if (!this.selectedEnactment) {
      this.onCreate();
    }
  }

}
