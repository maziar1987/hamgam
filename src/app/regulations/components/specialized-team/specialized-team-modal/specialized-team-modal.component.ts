import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng';
import { BasicValueDropdownComponent } from 'src/app/basicinfo/basic-value/basic-value-shared/basic-value-dropdown/basic-value-dropdown.component';
import { BasicValueService } from 'src/app/basicinfo/basic-value/basic-value.service';
import { ExpertPersonListSelectComponent } from 'src/app/expert-person/expert-person-shared/expert-person-list-select/expert-person-list-select.component';
import { ExpertPerson } from 'src/app/expert-person/expert-person.model';
import { BasicValue, BasicValueType } from '../../../../basicinfo/basic-value/basic-value.model';
import { FormContainerChildBaseComponent } from '../../../../form-container/models/form-container-child-base-component';
import { ExpertAppointment, Responsibility, TeamMember, TeamModal } from '../specialized-team.model';
import { SpecializesTeamService } from '../specializedTeam.service';

@Component({
  selector: 'app-specialized-team-modal',
  templateUrl: './specialized-team-modal.component.html',
  styleUrls: ['./specialized-team-modal.component.scss']
})
export class SpecializedTeamModalComponent extends FormContainerChildBaseComponent implements OnInit {
  @ViewChild('addExpertPerson') addExpertPersonModal: ExpertPersonListSelectComponent;
  @ViewChild('responsibilityTeamCombo') responsibilityTeamCombo: BasicValueDropdownComponent;
  selectedExpertPerson: ExpertPerson;
  fullName: string;
  placement = 'bottom';
  selectedResponsibility: BasicValue;
  responsibilities: BasicValue[] = [];
  responsibilityTeams: BasicValue[] = [];
  ExpertAppointments: ExpertAppointment[] = [];
  TeamMembers: TeamMember[] = [];

  constructor(
    private fb: FormBuilder,
    private basicinfoServic: BasicValueService,
    private specializesService: SpecializesTeamService,
    public ref: DynamicDialogRef,
  ) {
    super();
  }
  get expertPersonId() { return this.form.get('expertPersonId'); }
  get responsibilityId() { return this.form.get('responsibilityId'); }
  get startDate() { return this.form.get('startDate'); }
  get endDate() { return this.form.get('endDate'); }

  ngOnInit(): void {
    this.basicinfoServic.getBasicInfo(BasicValueType.responsibilityTeam).subscribe(res => { this.responsibilityTeams = res.children; });
    this.basicinfoServic.getBasicInfo(BasicValueType.responsibility).subscribe(res => { this.responsibilities = res.children; });
    this.form = this.fb.group({
      expertPersonId: [null, [Validators.required]],
      responsibilityId: [null, [Validators.required]],
      startDate: [new Date(), [Validators.required]],
      endDate: [null]
    });
    this.fullName = null;
    setTimeout(() => {
      this.responsibilityTeamCombo.basicInfoItems.
        find(x => x.value == this.responsibilityTeamCombo.basicInfoParent.children.
          find(x => x.code == Responsibility.Supervision.toString()).id).disabled = true;
    }, 1000)
  }

  onAddExpertPerson() {
    this.addExpertPersonModal.show();
  }

  selectExpertPerson(event: ExpertPerson) {
    this.fillTable(event);
    this.selectedExpertPerson = event;
    this.expertPersonId.setValue(this.selectedExpertPerson.id);
    this.fullName = `${this.selectedExpertPerson.firstName} ${this.selectedExpertPerson.lastName}`;
  }
  fillTable(Person: ExpertPerson) {
    this.ExpertAppointments = [];
    this.TeamMembers = [];
    this.specializesService.getExpertAppointments(Person.id).subscribe(res => {
      res.forEach(i => {
        const ExpertAppointment = {
          expertWorkingGroupTitle: i.expertWorkingGroupTitle,
          responsibilityId: i.responsibilityId,
          responsibilityName: this.responsibilities.filter(f => f.id == i.responsibilityId)[0].title
        } as ExpertAppointment;
        this.ExpertAppointments.push(ExpertAppointment);
      })
    });
    this.specializesService.getTeamMembers(Person.id).subscribe(res => {
      res.forEach(i => {
        const TeamMember = {
          certificateTitle: i.certificate.title,
          responsibilityName: this.responsibilityTeams.filter(f => f.id === i.responsibilityId)[0].title
        } as TeamMember;
        this.TeamMembers.push(TeamMember);
      });
    });



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
    if (this.TeamMembers.length >= 3) {
      this.translate.get('regulations.specializedTeam').subscribe(res => {
        this.errorNotify({ detail: res.message.maxMember, summary: res.message.error });
      });
      return;
    }
    var res = <TeamModal>{
      expertPerson: this.selectedExpertPerson,
      expertPersonId: this.expertPersonId.value,
      responsibilityId: this.responsibilityId.value,
      responsibilityCode: Number(this.selectedResponsibility.code),
      responsibility: this.selectedResponsibility,
      startDate: this.startDate.value,
      endDate: this.endDate.value
    };
    this.ref.close(res);

  }
  onBack() {
    this.ref.close();
  }

}
