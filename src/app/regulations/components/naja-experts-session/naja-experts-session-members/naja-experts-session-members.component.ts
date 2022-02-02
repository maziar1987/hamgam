import {Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {BaseComponent} from 'src/app/app-shared/base/base.component';
import {NajaExpertsSessionMember} from '../models/naja-experts-session-member';
import {NajaExpertsSessionEnactment} from '../models/naja-experts-session-enactment';
import {MenuItem} from 'primeng';

@Component({
  selector: 'app-naja-experts-session-members',
  templateUrl: './naja-experts-session-members.component.html',
  styleUrls: ['./naja-experts-session-members.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NajaExpertsSessionMembersComponent),
      multi: true
    }
  ]
})
export class NajaExpertsSessionMembersComponent extends BaseComponent implements OnInit, ControlValueAccessor {

  sessionMembersCols: any[];
  loading: boolean;

  sessionMembers: NajaExpertsSessionMember[] = [];
  selectedSessionMember: NajaExpertsSessionMember;

  displaySessionMember: boolean = false;

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
      this.sessionMembers = obj;
    } else {
      this.sessionMembers = [];
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
      this.sessionMembersCols = [
        {field: 'fullname', header: res.sessionMembers.fullname},
        {field: 'responsibility', header: res.sessionMembers.responsibility},
        {field: 'proxyName', header: res.sessionMembers.proxyName},
        {field: 'precense', header: res.sessionMembers.precense.precense}
      ];
    });
  }

  onCreate() {
    this.createForm();
    this.selectedSessionMember = ({
      id: null,
      precense: true,
      responsibility: null,
      fullname: null,
      proxyName: null
    } as NajaExpertsSessionMember);
    this.displaySessionMember = true;
  }

  onEdit(rowData: any) {
    this.updateForm(rowData);
    this.selectedSessionMember = rowData;
    this.displaySessionMember = true;
  }

  onDelete(rowData: any) {
    if (!rowData.id) {
      this.sessionMembers = this.sessionMembers.filter(value =>
        value.fullname !== rowData.fullname
      );
    } else {
      this.sessionMembers = this.sessionMembers.filter(value =>
        value.id !== rowData.id
      );
    }
  }

  addNewMember() {
    this.displaySessionMember = false;
    this.addSessionMember(this.form.value);
    this.onChange(this.sessionMembers);
  }

  editMember() {
    this.displaySessionMember = false;
    this.sessionMembers.forEach(member => {
      if (member.id === this.form.value.id) {
        member.proxyName = this.form.value.proxyName;
        member.fullname = this.form.value.fullname;
        member.precense = this.form.value.precense;
        member.responsibility = this.form.value.responsibility;
      }
    });
    this.onChange(this.sessionMembers);
  }

  cancel() {
    this.displaySessionMember = false;
  }

  get id() {
    return this.form.get('id');
  }

  get fullname() {
    return this.form.get('fullname');
  }

  get precense() {
    return this.form.get('precense');
  }

  get proxyName() {
    return this.form.get('proxyName');
  }

  get responsibility() {
    return this.form.get('responsibility');
  }

  createForm() {
    this.form = this.fb.group({
      id: [null],
      fullname: ['', Validators.required],
      precense: [true, Validators.required],
      proxyName: [null],
      responsibility: ['', Validators.required]
    });
  }

  updateForm(member: NajaExpertsSessionMember) {
    this.id.setValue(member.id);
    this.fullname.setValue(member.fullname);
    this.precense.setValue(member.precense);
    this.proxyName.setValue(member.proxyName);
    this.responsibility.setValue(member.responsibility);
  }

  getMenuItems(rowNode: NajaExpertsSessionMember): MenuItem[] {

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

  addSessionMember(sessionMember: NajaExpertsSessionMember): void {
    this.sessionMembers.push(this.createSessionMember(sessionMember));
  }

  createSessionMember(sessionMember: NajaExpertsSessionMember): NajaExpertsSessionMember {
    return <NajaExpertsSessionMember> {
      id: sessionMember?.id,
      fullname: sessionMember.fullname,
      precense: sessionMember.precense,
      proxyName: sessionMember.proxyName,
      responsibility: sessionMember.responsibility
    };
  }

}
