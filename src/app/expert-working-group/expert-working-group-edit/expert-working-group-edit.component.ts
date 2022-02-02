import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TreeNode } from 'primeng';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { BasicValueService } from 'src/app/basicinfo/basic-value/basic-value.service';
import { Orgunit } from 'src/app/basicinfo/orgunit/orgunit.model';
import { EntityType } from 'src/app/policy/models/entity-type.enum';
import { WorkflowButtonGroupService } from 'src/app/workflow/workflow-shared/workflow-button-group/services/workflow-button-group.service';
import { BasicValueType } from '../../basicinfo/basic-value/basic-value.model';
import { ExpertApprovementAddComponent } from '../expert-approvement-add/expert-approvement-add.component';
import { ExpertApprovement, ExpertWorkingGroup } from '../models';
import { ExpertWorkingGroupService } from '../services';

@Component({
  selector: 'app-expert-working-group-edit',
  templateUrl: './expert-working-group-edit.component.html',
  styleUrls: ['./expert-working-group-edit.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class ExpertWorkingGroupEditComponent extends BaseComponent implements OnInit {

  @ViewChild('accept_modal') accept_modal: AcceptComponent;
  @ViewChild('addExpertApprovement') addExpertApprovementModal: ExpertApprovementAddComponent;

  private _location: Location;
  cols: any[];
  loading: boolean;

  selectedNode: TreeNode;
  selectedCategory: Orgunit;
  currentUserOrgUnit: Orgunit;
  displayOrgUnitTree = false;
  workGroupTitle = '';
  expertWorkingGroup: ExpertWorkingGroup;

  _expertAppointments: ExpertApprovement[] = [];
  selectedExpertApprovement: ExpertApprovement;

  constructor(private location: Location,
    private elementRef: ElementRef,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private workingGroupService: ExpertWorkingGroupService,
    private basicValueService: BasicValueService,
    private workflowButtonGroupService: WorkflowButtonGroupService) {
    super();
    this._location = location;
  }

  ngOnInit(): void {
    this.createForm();
    this.createButtons();
    this.setColumns();

    this.activatedRoute.paramMap.subscribe(p => {
      const id = +p.get('id');

      this.workingGroupService.getExpertWorkingGroup(id).subscribe(res => {
        this.expertWorkingGroup = res;
        this.orgUnitService.getOrgUnit(res.categoryId).subscribe(orgUnit => {
          this.selectedCategory = orgUnit;
          this.setCategoryTitle();
        });
        this.basicValueService.getBasicValuesByIds(this.expertWorkingGroup.expertAppointments.map(x => x.responsibilityId)).subscribe(bv => {
          this.expertWorkingGroup.expertAppointments.map(appointment => {
            appointment.responsibility = bv.find(y => y.id === appointment.responsibilityId);
            return appointment;
          });
          this.setActivePerson();
        }, error => {
          console.error(error);
        });


        if (!this.expertWorkingGroup) {
          this.warningNotify({ detail: 'اطلاعاتی وجود ندارد', summary: 'اخطار' });
          this.onBack();
        }

        this.updateForm();
      }, error => {
        this.handleError(error);
      });
    });
  }

  get expertAppointmentsFormArray() { return this.form.get('expertAppointments') as FormArray; }
  get categoryId() { return this.form.get('categoryId'); }
  get title() { return this.form.get('title'); }

  private createForm() {
    this.form = this.fb.group({
      id: [null, Validators.required],
      expertAppointments: this.fb.array([], Validators.required),
      categoryId: [null],
      title: [null]
    });
  }

  private updateForm() {
    this.form.controls.id.setValue(this.expertWorkingGroup.id);
    this.form.controls.categoryId.setValue(this.expertWorkingGroup.categoryId);

    this.expertWorkingGroup.expertAppointments.forEach(approvement => {
      this.addExpertApprovement(approvement);
      this._expertAppointments = [...this._expertAppointments, approvement];
    });
  }

  createButtons() {
    this.workflowButtonGroupService.addCreateButton(({ srcElementEvent }: { srcElementEvent: any }): void => { this.onSubmit(); });
    this.workflowButtonGroupService.addBackButton((): void => { this.onBack(); });

    this.workflowButtonGroupService.createButtonCheckFormInvalid(this.form);

    this.workflowButtonGroupService.checkPolicy(EntityType.expertWorkingGroup);
  }

  setActivePerson() {
    this.expertWorkingGroup.expertAppointments.forEach(expertAppointment => {
      if (expertAppointment.endDate !== null && new Date(expertAppointment.endDate) < new Date()) {
        expertAppointment.isActive = false;
      } else {
        expertAppointment.isActive = true;
      }
    });
  }

  handleError(error: any) {
    console.error(error);
  }

  setColumns() {
    this.translate.get('expertPerson').subscribe(expertPerson => {
      this.translate.get('expertApprovement').subscribe(expertApprovement => {
        this.cols = [
          { field: 'firstName', header: expertPerson.firstName },
          { field: 'lastName', header: expertPerson.lastName },
          { field: 'responsibility', header: expertApprovement.responsibility },
          { field: 'startDate', header: expertApprovement.startDate },
          { field: 'endDate', header: expertApprovement.endDate }/*,
          {field: 'status', header: expertApprovement.status}*/
        ];
      });
    });
  }

  addExpertApprovement(expertApprovement: ExpertApprovement): void {
    this.expertAppointmentsFormArray.push(this.createNewExpertApprovement(expertApprovement));
  }

  createNewExpertApprovement(expertApprovement: ExpertApprovement): FormGroup {
    return this.fb.group({
      id: [expertApprovement.id],
      expertPersonId: [expertApprovement?.expertPersonId, [Validators.required]],
      responsibilityId: [expertApprovement?.responsibilityId, [Validators.required]],
      startDate: [expertApprovement?.startDate, [Validators.required]],
      endDate: [expertApprovement?.endDate],
      status: [expertApprovement?.status, [Validators.required]]
    });
  }

  onEdit(index: number, rowNode: ExpertApprovement) {
    this.addExpertApprovementModal.show({ index: index, expertApprovement: rowNode });
  }

  onDelete(index: number, rowNode: ExpertApprovement) {
    this._expertAppointments = this._expertAppointments.filter(x =>
      !(x.expertPersonId === rowNode.expertPersonId && x.responsibilityId === rowNode.responsibilityId));

    this.expertAppointmentsFormArray.removeAt(index);
  }

  onPersonInfo(index: number, expertApprovement: ExpertApprovement) {
    const url = 'experts/' + expertApprovement.expertPersonId;
    window.open(url, '_blank').focus();
  }

  onBack() {
    this._location.back();
  }

  onAddNewExpertApprovement() {
    this.addExpertApprovementModal.show();
  }

  addNewExpertApprovement(event: ExpertApprovement) {
    let exists = this._expertAppointments.find(x => x.expertPersonId === event.expertPersonId && (new Date(x.endDate) > new Date() || x.endDate === null));
    if (exists) {
      this.errorNotify({ detail: `فرد ${event.expertPerson.firstName + ' ' + event.expertPerson.lastName} تکراری است`, summary: 'رویدادخط' });
    } else {
      this.basicValueService.getBasicInfo(event.responsibilityId).subscribe(basicValue => {
        if (event.responsibilityId !== BasicValueType.personApprovementMember) {
          exists = this._expertAppointments.find(x => x.responsibilityId === event.responsibilityId && (new Date(x.endDate) > new Date() || x.endDate === null));
          if (exists) {
            this.errorNotify({ detail: `مسئولیت ${event.responsibility.title} تکراری است`, summary: 'رویداد خطا' });
            return;
          }
        }
        event.isActive = true;
        this._expertAppointments.push(event);
        this.addExpertApprovement(event);
      });
    }
  }

  editExpertApprovement(event: { index: number, expertApprovement: ExpertApprovement }) {
    const exists = this._expertAppointments.find(x => x.responsibilityId === event.expertApprovement.responsibilityId &&
      x.id !== event.expertApprovement.id);
    if (exists) {
      this.warningNotify({ detail: `مسئولیت ${event.expertApprovement.responsibility.title} تکراری است`, summary: 'اخطار' });
      return;
    }

    const currentApprovement = this._expertAppointments.find(x => x.id === event.expertApprovement.id);
    this.mapApprovement(currentApprovement, event.expertApprovement);
    this.expertAppointmentsFormArray.removeAt(event.index);
    this.addExpertApprovement(event.expertApprovement);
  }

  mapApprovement(currentApprovement: ExpertApprovement, newApprovement: ExpertApprovement) {
    currentApprovement.id = newApprovement.id;
    currentApprovement.expertPerson = newApprovement.expertPerson;
    currentApprovement.expertPersonId = newApprovement.expertPersonId;
    currentApprovement.responsibilityId = newApprovement.responsibilityId;
    currentApprovement.responsibility = newApprovement.responsibility;
    currentApprovement.startDate = newApprovement.startDate;
    currentApprovement.endDate = newApprovement.endDate;
    currentApprovement.status = newApprovement.status;
  }

  showOrgUnitTreeDialog() {
    this.displayOrgUnitTree = true;
  }

  nodeSelect(event: TreeNode) {
    this.selectedNode = event;
  }

  selectOrgUnit() {
    this.selectedCategory = this.selectedNode.data;
    this.setCategoryTitle();
    this.form.controls.categoryId.setValue(this.selectedCategory.id);
    this.displayOrgUnitTree = false;
  }

  setCategoryTitle() {
    this.workGroupTitle = 'کارگروه خبرگی آیین نامه های ' + this.selectedCategory.displayName;
    this.form.controls.title.setValue(this.workGroupTitle);
    this.expertWorkingGroup.title = this.workGroupTitle;
  }

  closeOrgUnitTreeDialog() {
    this.selectedCategory = null;
    this.categoryId.reset();
    this.displayOrgUnitTree = false;
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.workflowButtonGroupService.loading();
    this.workingGroupService.put(this.form.value).subscribe(res => {
      this.workflowButtonGroupService.unLoading();
      this.successNotify({ detail: 'عملیات ویرایش با موفقیت انجام شد', summary: 'عملیات موفق' });
      this.onBack();
    }, error => {
      console.error(error);
      this.workflowButtonGroupService.unLoading();
      this.errorNotify();
    });
  }

}
