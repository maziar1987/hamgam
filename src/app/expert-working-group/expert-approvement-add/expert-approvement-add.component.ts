import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { BasicValue, BasicValueType } from 'src/app/basicinfo/basic-value/basic-value.model';
import { ExpertPersonListSelectComponent } from 'src/app/expert-person/expert-person-shared/expert-person-list-select/expert-person-list-select.component';
import { ExpertPerson } from 'src/app/expert-person/expert-person.model';
import { BasicValueService } from '../../basicinfo/basic-value/basic-value.service';
import { ExpertAppointment, TeamMember } from '../../regulations/components/specialized-team/specialized-team.model';
import { SpecializesTeamService } from '../../regulations/components/specialized-team/specializedTeam.service';
import { ExpertApprovement } from '../models';
import { ExpertWorkingGroupService } from '../services';

@Component({
  selector: 'app-expert-approvement-add',
  templateUrl: './expert-approvement-add.component.html',
  styleUrls: ['./expert-approvement-add.component.scss']
})
export class ExpertApprovementAddComponent extends BaseComponent implements OnInit {

  @ViewChild('addExpertPerson') addExpertPersonModal: ExpertPersonListSelectComponent;

  placement = 'bottom';

  displayAddMember: boolean;
  @Output() add: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  selectedExpertPerson: ExpertPerson;
  selectedResponsibility: BasicValue;
  fullName: string;
  selectedExpertApprovement: ExpertApprovement;
  selectedExpertApprovementIndex: number;
  editMode = false;
  teamMembers: TeamMember[] = [];
  expertAppointments: ExpertAppointment[] = [];
  responsibilities: BasicValue[] = [];
  responsibilityTeams: BasicValue[] = [];

  constructor(private fb: FormBuilder,
    private specializesService: SpecializesTeamService,
    private workingGroupService: ExpertWorkingGroupService,
    private basicInfoService: BasicValueService) {
    super();
    this.basicInfoService.getBasicInfo(BasicValueType.responsibilityTeam).subscribe(res => { this.responsibilityTeams = res.children; });
    this.basicInfoService.getBasicInfo(BasicValueType.responsibility).subscribe(res => { this.responsibilities = res.children; });
  }

  ngOnInit(): void {
    this.createForm();
  }

  getBasicValueType(basicValueType: string) {
    return BasicValueType[basicValueType];
  }

  get expertPersonId() { return this.form.get('expertPersonId'); }
  get startDate() { return this.form.get('startDate'); }
  get endDate() { return this.form.get('endDate'); }
  get status() { return this.form.get('status'); }

  createForm() {
    this.form = this.fb.group({
      expertPersonId: [null, [Validators.required]],
      responsibilityId: [null, [Validators.required]],
      startDate: [new Date(), [Validators.required]],
      endDate: [null],
      status: [true]
    });
  }

  public show(input?: { index: number, expertApprovement: ExpertApprovement }) {
    this.createForm();
    this.selectedExpertPerson = null;
    this.selectedResponsibility = null;
    this.fullName = null;
    this.displayAddMember = true;
    this.editMode = false;
    this.expertAppointments = null;
    this.teamMembers = null;

    if (input?.expertApprovement) {
      this.selectedExpertApprovement = input.expertApprovement;
      this.selectedExpertApprovementIndex = input.index;
      this.selectExpertPerson(input.expertApprovement.expertPerson);
      this.selectedResponsibility = input.expertApprovement.responsibility;
      this.editMode = true;

      this.form.controls.responsibilityId.setValue(input.expertApprovement.responsibility.id);
      this.form.controls.startDate.setValue(input.expertApprovement.startDate);
      this.form.controls.endDate.setValue(input.expertApprovement.endDate);
      this.form.controls.status.setValue(input.expertApprovement.status);
    }
  }

  onAdd() {
    var res = <ExpertApprovement>{
      expertPerson: this.selectedExpertPerson,
      expertPersonId: this.expertPersonId.value,
      responsibilityId: this.selectedResponsibility.id,
      responsibility: this.selectedResponsibility,
      startDate: this.startDate.value,
      endDate: this.endDate.value,
      status: this.status.value
    };
    this.add.emit(res);
    this.onBack();
  }

  onEdit() {
    var res = <ExpertApprovement>{
      id: this.selectedExpertApprovement.id,
      expertPerson: this.selectedExpertPerson,
      expertPersonId: this.expertPersonId.value,
      responsibilityId: this.selectedResponsibility.id,
      responsibility: this.selectedResponsibility,
      startDate: this.startDate.value,
      endDate: this.endDate.value,
      status: this.status.value
    };
    this.edit.emit({ index: this.selectedExpertApprovementIndex, expertApprovement: res });
    this.onBack();
  }

  onBack() {
    this.displayAddMember = false;
  }

  selectResponsibility(event: BasicValue) {
    this.selectedResponsibility = event;
  }

  onAddExpertPerson() {
    this.addExpertPersonModal.show();
  }

  selectExpertPerson(event: ExpertPerson) {
    this.selectedExpertPerson = event;
    this.fillTable();
    this.expertPersonId.setValue(this.selectedExpertPerson.id);
    this.fullName = `${this.selectedExpertPerson.firstName} ${this.selectedExpertPerson.lastName}`;
  }

  fillTable() {
    this.expertAppointments = [];
    this.teamMembers = [];
    this.specializesService.getExpertAppointments(this.selectedExpertPerson.id).subscribe(res => {
      res.forEach(i => {
        // this.workingGroupService.getExpertWorkingGroup(i.expertWorkingGroupId).subscribe(workingGroup => {
        // });
        const expertAppointment = {
          expertWorkingGroupTitle: i.expertWorkingGroupTitle,
          responsibilityId: i.responsibilityId,
          responsibilityName: this.responsibilities.filter(f => f.id === i.responsibilityId)[0].title
        } as ExpertAppointment;
        this.expertAppointments.push(expertAppointment);
      });
    });
    this.specializesService.getTeamMembers(this.selectedExpertPerson.id).subscribe(res => {
      res.forEach(i => {
        const teamMember = {
          certificateTitle: i.certificate.title,
          responsibilityName: this.responsibilityTeams.filter(f => f.id === i.responsibilityId)[0].title
        } as TeamMember;
        this.teamMembers.push(teamMember);
      });
    });
  }

}
