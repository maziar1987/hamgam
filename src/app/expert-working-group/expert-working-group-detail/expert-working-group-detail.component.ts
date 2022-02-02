import { Location } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { BasicValueService } from 'src/app/basicinfo/basic-value/basic-value.service';
import { Orgunit } from 'src/app/basicinfo/orgunit/orgunit.model';
import { WorkflowButtonGroupService } from 'src/app/workflow/workflow-shared/workflow-button-group/services/workflow-button-group.service';
import { ExpertApprovement, ExpertWorkingGroup } from '../models';
import { ExpertWorkingGroupService } from '../services';

@Component({
  selector: 'app-expert-working-group-detail',
  templateUrl: './expert-working-group-detail.component.html',
  styleUrls: ['./expert-working-group-detail.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class ExpertWorkingGroupDetailComponent extends BaseComponent implements OnInit {

  private _location: Location;
  cols: any[];
  loading: boolean;

  currentUserOrgunit: Orgunit;
  expertWorkingGroup: ExpertWorkingGroup;
  selectedCategory: Orgunit;
  _expertAppointments: ExpertApprovement[] = [];
  selectedExpertApprovement: ExpertApprovement;

  constructor(
    private location: Location,
    private elementRef: ElementRef,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
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
      var id = +p.get('id');

      this.workingGroupService.getExpertWorkingGroup(id).subscribe(res => {
        this.expertWorkingGroup = res;
        this.orgUnitService.getOrgUnit(res.categoryId).subscribe(orgUnit => {
          this.selectedCategory = orgUnit;
        });
        this.basicValueService.getBasicValuesByIds(
          this.expertWorkingGroup.expertAppointments.map(x => x.responsibilityId)
        ).subscribe(bv => {
          this.expertWorkingGroup.expertAppointments.map(x => {
            x.responsibility = bv.find(y => y.id === x.responsibilityId);
            return x;
          });
        }, error => {
          console.error(error);
        });

        if (!this.expertWorkingGroup) {
          this.warningNotify({ detail: 'اطلاعاتی وجود ندارد', summary: "اخطار" });
          this.onBack();
        }

        this.updateForm();
      }, error => {
        this.handleError(error);
      });
    });
  }

  get workGroupTitle() { return 'کارگروه خبرگی آیین نامه های ' + this.selectedCategory?.displayName; }

  get expertAppointmentsFormArray() { return this.form.get('expertAppointments') as FormArray; }

  private createForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      expertAppointments: this.fb.array([]),
      categoryId: [null]
    });
  }

  private updateForm() {
    this.form.controls.title.setValue(this.expertWorkingGroup.title);
    this.form.controls.categoryId.setValue(this.expertWorkingGroup.categoryId);

    this.expertWorkingGroup.expertAppointments.forEach(approvement => {
      this.addExpertApprovement(approvement);
      this._expertAppointments = [...this._expertAppointments, approvement];
    });
  }

  createButtons() {
    this.workflowButtonGroupService.addBackButton((): void => { this.onBack(); });
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
          { field: 'status', header: expertApprovement.status }*/
        ];
      })
    });
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

  onBack() {
    this._location.back();
  }

  handleError(error: any) {
    console.error(error);
  }

}
