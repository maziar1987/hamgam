import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TreeNode } from 'primeng';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { BasicValueType } from 'src/app/basicinfo/basic-value/basic-value.model';
import { EntityType } from 'src/app/policy/models/entity-type.enum';
import { WorkflowButtonGroupService } from 'src/app/workflow/workflow-shared/workflow-button-group/services/workflow-button-group.service';
import { BasicValueService } from '../../basicinfo/basic-value/basic-value.service';
import { ExpertApprovementAddComponent } from '../expert-approvement-add/expert-approvement-add.component';
import { ExpertApprovement } from '../models';
import { ExpertWorkingGroupService } from '../services';

@Component({
  selector: 'app-expert-working-group-create',
  templateUrl: './expert-working-group-create.component.html',
  styleUrls: ['./expert-working-group-create.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class ExpertWorkingGroupCreateComponent extends BaseComponent implements OnInit {

  @ViewChild('addExpertApprovement') addExpertApprovementModal: ExpertApprovementAddComponent;

  cols: any[];
  loading: boolean;

  expertAppointments: ExpertApprovement[] = [];
  selectedExpertApprovement: ExpertApprovement;
  displayOrgUnitTree = false;
  selectedNode: TreeNode;

  private _location: Location;

  constructor(
    private location: Location,
    private basicValueService: BasicValueService,
    private workingGroupService: ExpertWorkingGroupService,
    private fb: FormBuilder,
    private workflowButtonGroupService: WorkflowButtonGroupService
  ) {
    super();

    this._location = location;
  }

  ngOnInit(): void {
    this.createForm();
    this.createButtons();
    this.setColumns();
  }

  get expertAppointmentsFormArray() { return this.form.get('expertAppointments') as FormArray; }
  get categoryId() { return this.form.get('categoryId'); }
  get title() { return this.form.get('title'); }

  private createForm() {
    this.form = this.fb.group({
      expertAppointments: this.fb.array([], Validators.required),
      categoryId: ['', [Validators.required]],
      title: ['', [Validators.required]]
    });
  }

  createButtons() {
    this.workflowButtonGroupService.addCreateButton(({ srcElementEvent }: { srcElementEvent: any }): void => { this.onSubmit(); });
    this.workflowButtonGroupService.addBackButton((): void => { this.onBack(); });

    this.workflowButtonGroupService.createButtonCheckFormInvalid(this.form);

    this.workflowButtonGroupService.checkPolicy(EntityType.expertWorkingGroup);
  }

  addExpertApprovement(expertApprovement: ExpertApprovement): void {
    this.expertAppointmentsFormArray.push(this.createNewExpertApprovement(expertApprovement));
  }

  createNewExpertApprovement(expertApprovement: ExpertApprovement): FormGroup {
    return this.fb.group({
      expertPersonId: [expertApprovement?.expertPersonId, [Validators.required]],
      responsibilityId: [expertApprovement?.responsibilityId, [Validators.required]],
      startDate: [expertApprovement?.startDate, [Validators.required]],
      endDate: [expertApprovement?.endDate],
      status: [expertApprovement?.status, [Validators.required]]
    });
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

  onAddNewExpertApprovement() {
    this.addExpertApprovementModal.show();
  }

  addNewExpertApprovement(event: ExpertApprovement) {
    let exists = this.expertAppointments.find(x => x.expertPersonId === event.expertPersonId && (new Date(x.endDate) > new Date() || x.endDate === null));
    if (exists) {
      this.errorNotify({ detail: `فرد ${event.expertPerson.firstName + ' ' + event.expertPerson.lastName} تکراری است`, summary: 'رویداد خطا' });
    } else {
      this.basicValueService.getBasicInfo(event.responsibilityId).subscribe(basicValue => {
        if (event.responsibilityId !== BasicValueType.personApprovementMember) {
          exists = this.expertAppointments.find(x => x.responsibilityId === event.responsibilityId && (new Date(x.endDate) > new Date() || x.endDate === null));
          if (exists) {
            this.errorNotify({ detail: `مسئولیت ${event.responsibility.title} تکراری است`, summary: 'رویداد خطا' });
            return;
          }
        }
        this.expertAppointments.push(event);
        this.addExpertApprovement(event);
      });
    }
  }

  onDelete(index: number, rowNode: ExpertApprovement) {
    this.expertAppointments = this.expertAppointments.filter(x =>
      !(x.expertPersonId === rowNode.expertPersonId && x.responsibilityId === rowNode.responsibilityId));

    this.expertAppointmentsFormArray.removeAt(index);
  }

  onPersonInfo(index: number, expertApprovement: ExpertApprovement) {
    const url = 'experts/' + expertApprovement.expertPersonId;
    window.open(url, '_blank').focus();
  }

  nodeSelect(event: TreeNode) {
    this.selectedNode = event;
  }

  selectOrgUnit() {
    var selectedOrgUnit = this.selectedNode.data;
    this.categoryId.setValue(selectedOrgUnit.id);
    this.title.setValue(`کارگروه خبرگی آیین نامه های ${selectedOrgUnit.displayName}`);
    this.displayOrgUnitTree = false;
  }

  showOrgUnitTreeDialog() {
    this.displayOrgUnitTree = true;
  }

  closeOrgUnitTreeDialog() {
    this.categoryId.reset();
    this.title.reset();
    this.displayOrgUnitTree = false;
  }

  onBack() {
    this._location.back();
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.workflowButtonGroupService.loading();
    this.workingGroupService.post(this.form.value).subscribe(res => {
      this.workflowButtonGroupService.unLoading();
      this.successNotify({ detail: 'عملیات ثبت با موفقیت انجام شد', summary: 'عملیات موفق' });
      this.onBack();
    }, error => {
      console.error(error);
      this.workflowButtonGroupService.unLoading();
      if (error.error?.expertworkinggroup === 'duplicate') {
        this.errorNotify({ detail: 'عنوان کارگروه تکرای می باشد.', summary: 'رخداد خطا' });
      } else {
        this.errorNotify();
      }
    });
  }

}
