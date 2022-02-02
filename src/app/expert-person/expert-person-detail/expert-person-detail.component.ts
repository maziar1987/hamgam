import { Location } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AppFileManagerService } from 'src/app/app-file-manager/app-file-manager.service';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { LoggerService } from 'src/app/app-shared/services/logger.service';
import { BasicValue } from 'src/app/basicinfo/basic-value/basic-value.model';
import { BasicValueService } from 'src/app/basicinfo/basic-value/basic-value.service';
import { Orgunit } from 'src/app/basicinfo/orgunit/orgunit.model';
import { ActivityObject, ActivitySend } from 'src/app/cartable-new/models';
import { ExpertPersonVariableValue, StartProcessInstanceBody } from 'src/app/cartable-new/models/start-process-instance-body';
import { ActivityService } from 'src/app/cartable-new/services/activity.service';
import { SendType } from 'src/app/cartable/models/activity.model';
import { WorkflowVariableType } from 'src/app/cartable/models/workflow-variable-type.enum';
import { EntityType } from 'src/app/policy/models/entity-type.enum';
import { WorkflowButtonGroupService } from 'src/app/workflow/workflow-shared/workflow-button-group/services/workflow-button-group.service';
import { OrgUnit } from '../../basicinfo/org-unit/models/org-unit';
import { ExpertPerson, PersonType, RelationType, ServiceStatus } from '../expert-person.model';
import { ExpertPersonService } from '../expert-person.service';

@Component({
  selector: 'app-expert-person-detail',
  templateUrl: './expert-person-detail.component.html',
  styleUrls: ['./expert-person-detail.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class ExpertPersonDetailComponent extends BaseComponent implements OnInit {

  relationTypes = RelationType;
  serviceStatuses = ServiceStatus;
  expertPerson: ExpertPerson;
  personTypes = PersonType;

  personImageFile: any;
  personImageFileUrl: any = '../../../../assets/img/user1.jpg';
  educationImageFile: any;
  attachmentFile: any;

  fromCartable: boolean;
  activityId: number;
  wfTaskId: any;
  workflowStep: any;
  serviceLocation: Orgunit;
  category: OrgUnit;

  private _location: Location;
  degree: BasicValue;
  educationDegree: BasicValue;
  studyField: BasicValue;
  receiverId: any;
  senderUserId: number;

  cartableMode = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private elementRef: ElementRef,
    private logger: LoggerService,
    private expertPersonService: ExpertPersonService,
    public appFileManager: AppFileManagerService,
    private sanitizer: DomSanitizer,
    private basicValueService: BasicValueService,
    private workflowButtonGroupService: WorkflowButtonGroupService,
    private activityService: ActivityService
  ) {
    super();

    this._location = location;
  }

  ngOnInit(): void {

    this.createForm();

    this.route.paramMap.subscribe(p => {
      var id = +p.get('id');

      this.activityId = +p.get('aid');
      this.wfTaskId = p.get('wfTaskId');
      this.workflowStep = p.get('workflowStep');
      this.senderUserId = +p.get('senderUserId');

      if (this.activityId) {
        this.cartableMode = true;
      }

      this.createButtons();

      this.expertPersonService.getExpertPerson(id).subscribe(res => {
        this.expertPerson = res;

        if (!this.expertPerson) {
          this.warningNotify({ detail: 'اطلاعاتی وجود ندارد', summary: 'اخطار' });
          this.onBack();
        }

        this.workflowButtonGroupService.setEditButtonDisabled(this.expertPerson?.status?.code == '4' || this.expertPerson?.status?.code == '5');

        this.updateForm();
      }, error => {
        this.errorNotify({ detail: `اطلاعاتی برای شناسه "${id}" وجود ندارد`, summary: 'خطا' });
        this.handleError(error);
        this.onBack();
      });
    });
  }

  get attachmentFileName() {
    return this.attachmentFile instanceof File ? this.attachmentFile?.name : this.expertPerson?.attachment?.fileName;
  }

  get educationImageFileName() {
    return this.educationImageFile instanceof File ? this.educationImageFile?.name : this.expertPerson?.educationImage?.fileName;
  }

  get firstName() { return this.form.get('firstName'); }
  get lastName() { return this.form.get('lastName'); }
  get status() { return this.form.get('status'); }

  createForm() {
    this.form = this.formBuilder.group({
      id: [''],
      categoryId: [null],
      personType: [PersonType.INTERNAL],
      personnelCode: [''],
      nationalCode: [''],
      firstName: [''],
      lastName: [''],
      fatherName: [''],
      birthDate: [null],
      educationDegreeId: [null],
      studyFieldId: [null],
      relation: [RelationType.military],
      serviceStatus: [ServiceStatus.employed],
      serviceLocationId: [null],
      degreeId: [null],
      employmentDate: [null],
      currentResponsibility: [''],
      threePreviousPosition: [''],
      scientificExperiencesRecords: [''],
      accountNumber: [''],
      shabaNumber: [''],
      // personImage: ['', ],
      // educationImage: [null,[Validators.required]],
      // attachment: [''],
      description: [''],
      inactive: false,
      status: null
    });
  }

  createButtons() {
    if (this.cartableMode) {
      this.workflowButtonGroupService.addAcceptButton(({ srcElementEvent }: { srcElementEvent: any }): void => { this.onConfirm(null); });
      this.workflowButtonGroupService.addUnacceptButton(({ srcElementEvent }: { srcElementEvent: any }): void => { this.onUnConfirm(null); });
    }

    this.workflowButtonGroupService.addBackButton((): void => { this.onBack(); });

    this.workflowButtonGroupService.checkPolicy(EntityType.expertPerson);
  }

  updateForm() {
    this.form.controls.id.setValue(this.expertPerson.id);
    this.form.controls.categoryId.setValue(this.expertPerson.categoryId);

    this.orgUnitService.getOrgUnit(this.form.controls.categoryId.value).subscribe(orgUnit => {
      this.category = orgUnit;
    }, error => {
      console.error(error);
    });

    this.form.controls.personType.setValue(PersonType[this.expertPerson.personType.toString().toLowerCase()]);
    this.form.controls.personnelCode.setValue(this.expertPerson.personnelCode);
    this.form.controls.nationalCode.setValue(this.expertPerson.nationalCode);
    this.form.controls.firstName.setValue(this.expertPerson.firstName);
    this.form.controls.lastName.setValue(this.expertPerson.lastName);
    this.form.controls.fatherName.setValue(this.expertPerson.fatherName);

    if (this.expertPerson.birthDate) {
      var birthDateTemp = this.expertPerson.birthDate.toString();
      var birthDate = new Date(Date.UTC(+birthDateTemp.split('T')[0].split('-')[0], +birthDateTemp.split('T')[0].split('-')[1] - 1, +birthDateTemp.split('T')[0].split('-')[2]));

      this.form.controls.birthDate.setValue(birthDate);
    }

    this.form.controls.educationDegreeId.setValue(this.expertPerson.educationDegreeId);
    this.basicValueService.getBasicInfo(this.form.controls.educationDegreeId.value).subscribe(res => {
      this.educationDegree = res;
    }, error => {
      this.handleError(error);
    });
    this.form.controls.studyFieldId.setValue(this.expertPerson.studyFieldId);
    this.basicValueService.getBasicInfo(this.form.controls.studyFieldId.value).subscribe(res => {
      this.studyField = res;
    }, error => {
      this.handleError(error);
    });
    this.form.controls.relation.setValue(RelationType[this.expertPerson.relation.toString().toLowerCase()]);
    this.form.controls.serviceStatus.setValue(ServiceStatus[this.expertPerson.serviceStatus.toString().toLowerCase()]);
    this.form.controls.serviceLocationId.setValue(this.expertPerson.serviceLocationId);

    this.orgUnitService.getOrgUnit(this.form.controls.serviceLocationId.value).subscribe(res => {
      this.serviceLocation = res;
    }, error => {
      this.handleError(error);
    });

    this.form.controls.degreeId.setValue(this.expertPerson.degreeId);
    this.basicValueService.getBasicInfo(this.form.controls.degreeId.value).subscribe(res => {
      this.degree = res;
    }, error => {
      this.handleError(error);
    });

    if (this.expertPerson.employmentDate) {
      var employmentDateTemp = this.expertPerson.employmentDate.toString();
      var employmentDate = new Date(Date.UTC(+employmentDateTemp.split('T')[0].split('-')[0], +employmentDateTemp.split('T')[0].split('-')[1] - 1, +employmentDateTemp.split('T')[0].split('-')[2]));

      this.form.controls.employmentDate.setValue(employmentDate);
    }

    this.form.controls.currentResponsibility.setValue(this.expertPerson.currentResponsibility);
    this.form.controls.threePreviousPosition.setValue(this.expertPerson.threePreviousPosition);
    this.form.controls.scientificExperiencesRecords.setValue(this.expertPerson.scientificExperiencesRecords);
    this.form.controls.accountNumber.setValue(this.expertPerson.accountNumber);
    this.form.controls.shabaNumber.setValue(this.expertPerson.shabaNumber);
    this.form.controls.description.setValue(this.expertPerson.description);
    this.form.controls.inactive.setValue(this.expertPerson.inactive);
    this.form.controls.status.setValue(this.expertPerson.status);

    if (this.expertPerson.personImageId) {
      this.appFileManager.getFile(this.expertPerson.personImageId).subscribe(async (res) => {

        this.expertPerson.personImage = res;
        let objectURL = `data:${res.dataContentType};base64,` + res.data;

        this.personImageFileUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        this.personImageFile = await this.appFileManager.convertToFile(objectURL, this.expertPerson.personImage);
      });
    }

    if (this.expertPerson.educationImageId) {
      this.appFileManager.getFile(this.expertPerson.educationImageId).subscribe(async (res) => {

        this.expertPerson.educationImage = res;
        this.educationImageFile = `data:${res.dataContentType};base64,` + res.data;

        this.educationImageFile = await this.appFileManager.convertToFile(this.educationImageFile, this.expertPerson.educationImage);
      });
    }

    if (this.expertPerson.attachmentId) {
      this.appFileManager.getFile(this.expertPerson.attachmentId).subscribe(async (res) => {

        this.expertPerson.attachment = res;
        this.attachmentFile = `data:${res.dataContentType};base64,` + res.data;

        this.attachmentFile = await this.appFileManager.convertToFile(this.attachmentFile, this.expertPerson.attachment);
      });
    }

  }

  handleError(error: any) {
    this.logger.error(error);
  }

  onConfirm(activity: ActivitySend) {
    this.send(activity, this.expertPerson, ExpertPersonVariableValue.approve);
  }

  onUnConfirm(activity: ActivitySend) {
    this.send(activity, this.expertPerson, ExpertPersonVariableValue.reject);
  }

  onReturn(activity: ActivitySend) {
    this.send(activity, this.expertPerson, ExpertPersonVariableValue.return);
  }

  send(activityInput: ActivitySend, expertPerson: ExpertPerson, accept: ExpertPersonVariableValue) {
    console.log('complete process expertPerson: ', expertPerson);

    var obj: ActivityObject =
    {
      name: 'ExpertPerson',
      objectType: 'ExpertPerson',
      objectId: expertPerson.id
    };

    var activity: ActivitySend =
    {
      sendType: SendType.SENDBACK,
      text: activityInput?.text,
      subject: activityInput?.subject,
      classificationId: activityInput?.classificationId,
      priorityId: activityInput?.priorityId,
      activityObject: obj,
      // receivers: [this.senderUserId]
    };

    var startProcessInstanceBody = <StartProcessInstanceBody>{
      businessKey: expertPerson.id.toString(),
      variables: {
        action: { value: ExpertPersonVariableValue[accept], type: WorkflowVariableType[WorkflowVariableType.String] },
        formName: { value: 'ExpertPerson', type: WorkflowVariableType[WorkflowVariableType.String] },
        unitId: { value: this.currentUser.orgUnit.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        userId: { value: this.currentUser.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        taskId: { value: this.wfTaskId, type: WorkflowVariableType[WorkflowVariableType.String] }
      }
    };

    this.activityService.completeProcess(activity, startProcessInstanceBody, this.activityId).subscribe(res => {
      this.successNotify({ detail: 'اتمام فرآیند فرد خبره', summary: 'عملیات موفق' });
      this.onBack();
    }, error => {
      this.errorNotify({ detail: 'خطا در ادامه فرآیند فرد خبره', summary: 'رخداد خطا' });
    });
  }

  onBack() {
    this._location.back();
  }

}
