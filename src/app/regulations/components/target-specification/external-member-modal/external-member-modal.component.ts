import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { MemberType } from '../models/member-type.enum';
import { TargetSpecificationMember } from '../models/target-specification-member';

@Component({
  selector: 'app-external-member-modal',
  templateUrl: './external-member-modal.component.html',
  styleUrls: ['./external-member-modal.component.scss']
})
export class ExternalMemberModalComponent extends BaseComponent implements OnInit {

  @Output() add: EventEmitter<TargetSpecificationMember> = new EventEmitter();
  @Output() edit: EventEmitter<TargetSpecificationMember> = new EventEmitter();

  display: boolean = false;
  member: TargetSpecificationMember = null;
  editMode: boolean = false;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
  }

  get memberName() { return this.form.get('memberName') }
  get memberPost() { return this.form.get('memberPost') }

  createForm() {
    this.form = this.fb.group({
      memberName: [null, [Validators.required]],
      memberPost: [null, [Validators.required]]
    });
  }

  updateForm() {
    this.form.controls.memberName.setValue(this.member.memberName);
    this.form.controls.memberPost.setValue(this.member.memberPost);
  }

  show(member: TargetSpecificationMember | null = null) {
    this.form.reset();
    this.member = member;
    this.display = true;
    this.editMode = member != null;
    if (this.editMode) {
      this.updateForm();
    }
  }

  onSubmit() {
    if (this.editMode) {
      this.editMember();
    } else {
      this.addMember();
    }
  }

  addMember() {
    this.add.emit(<TargetSpecificationMember>{
      memberName: this.memberName.value,
      memberPost: this.memberPost.value,
      memberType: MemberType.FOREIGNMEMBER
    })
    this.cancel();
  }

  editMember() {
    this.member.memberName = this.memberName.value;
    this.member.memberPost = this.memberPost.value;

    this.edit.emit(this.member);
    this.cancel();
  }

  cancel() {
    this.display = false;
  }

}
