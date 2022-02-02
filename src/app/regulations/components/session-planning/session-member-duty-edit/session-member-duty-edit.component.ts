import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { SessionMemberDuty } from '../models';

@Component({
  selector: 'app-session-member-duty-edit',
  templateUrl: './session-member-duty-edit.component.html',
  styleUrls: ['./session-member-duty-edit.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SessionMemberDutyEditComponent),
      multi: true
    }
  ]
})
export class SessionMemberDutyEditComponent extends BaseComponent implements OnInit, ControlValueAccessor {

  isDisabled: boolean = false;
  sessionMemberDuties: SessionMemberDuty[] | null = null;

  cols: any;

  // Function to call when the model changes.
  onChange = (_: any) => {
  };
  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => {
  };

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.setColumns();
  }

  writeValue(obj: any): void {
    this.sessionMemberDuties = obj;
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

  getMemberName(sessionMemberDuty: SessionMemberDuty) {
    return sessionMemberDuty?.targetSpecificationMember?.memberName || sessionMemberDuty?.targetSpecificationMember?.teamMember?.expertPerson?.firstName + ' ' + sessionMemberDuty?.targetSpecificationMember?.teamMember?.expertPerson?.lastName;
  }

  getMemberPost(sessionMemberDuty: SessionMemberDuty) {
    return sessionMemberDuty.targetSpecificationMember.memberPost;
  }

  setColumns() {
    this.translate.get('sessionPlanning.sessionMemberDuty').subscribe(res => {
      this.cols = [
        { field: 'memberName', header: res.memberName },
        { field: 'memberPost', header: res.memberPost },
        { field: 'duty', header: res.duty }
      ];
    });
  }

}
