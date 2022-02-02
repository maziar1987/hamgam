import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { SpecializesTeamService } from '../../specialized-team/specializedTeam.service';
import { MemberType } from '../models/member-type.enum';
import { TargetSpecificationMember } from '../models/target-specification-member';

@Component({
  selector: 'app-team-member-modal',
  templateUrl: './team-member-modal.component.html',
  styleUrls: ['./team-member-modal.component.scss']
})
export class TeamMemberModalComponent extends BaseComponent implements OnInit {

  @Output() add: EventEmitter<TargetSpecificationMember> = new EventEmitter();
  @Output() edit: EventEmitter<TargetSpecificationMember> = new EventEmitter();

  display: boolean = false;
  targetSpecificationMember: TargetSpecificationMember = null;
  editMode: boolean = false;
  teamMemberItems: SelectItem[];

  constructor(
    private fb: FormBuilder,
    private specializesTeamService: SpecializesTeamService) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
  }

  setTeamMembers(certificateId: number) {
    if (certificateId) {
      this.specializesTeamService.getSpecializesTeamByCertificate(certificateId).subscribe(res => {
        this.teamMemberItems = res.map(x => <SelectItem>{ label: `${x.expertPerson.firstName} ${x.expertPerson.lastName}`, value: x });
        this.setTeamMemberItem();
      }, error => {
        console.error(error);
      });
    }
  }

  setTeamMemberItem() {
    if (this.editMode) {
      this.teamMember.setValue(this.teamMemberItems.find(x => x.value.id == this.targetSpecificationMember.teamMember.id)?.value);
    } else {
      if (this.teamMemberItems?.length > 0) {
        this.teamMember.setValue(this.teamMemberItems[0].value);
      }
    }
  }

  get teamMember() { return this.form.get('teamMember') }
  get memberPost() { return this.form.get('memberPost') }

  createForm() {
    this.form = this.fb.group({
      teamMember: [null, [Validators.required]],
      memberPost: [null, [Validators.required]]
    });
  }

  updateForm() {
    // this.teamMember.setValue(this.targetSpecificationMember.teamMember);
    this.memberPost.setValue(this.targetSpecificationMember.memberPost);
  }

  show(certificateId: number, targetSpecificationMember: TargetSpecificationMember | null = null) {
    this.targetSpecificationMember = targetSpecificationMember;
    this.editMode = targetSpecificationMember != null;
    this.form.reset();

    this.setTeamMembers(certificateId);

    if (this.editMode) {
      this.updateForm();
    }

    this.display = true;
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
      teamMemberId: this.teamMember.value.id,
      teamMember: this.teamMember.value,
      memberPost: this.memberPost.value,
      memberType: MemberType.INTERNALMEMBER
    })
    this.cancel();
  }

  editMember() {
    this.targetSpecificationMember.teamMemberId = this.teamMember.value.id;
    this.targetSpecificationMember.teamMember = this.teamMember.value;
    this.targetSpecificationMember.memberPost = this.memberPost.value;

    this.edit.emit(this.targetSpecificationMember);
    this.cancel();
  }

  cancel() {
    this.display = false;
  }

}
