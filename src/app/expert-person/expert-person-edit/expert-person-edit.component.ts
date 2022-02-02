import { Location } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { FormFile } from 'src/app/app-shared/base/form-file';
import { Orgunit } from 'src/app/basicinfo/orgunit/orgunit.model';
import { Person_ } from 'src/app/basicinfo/orgunit/person.model';
import { PersonService } from 'src/app/basicinfo/orgunit/person.service';
import { ActivityObject, ActivitySend } from 'src/app/cartable-new/models';
import { StartProcessInstanceBody } from 'src/app/cartable-new/models/start-process-instance-body';
import { ActivityService } from 'src/app/cartable-new/services/activity.service';
import { SendType } from 'src/app/cartable/models/activity.model';
import { WorkflowVariableType } from 'src/app/cartable/models/workflow-variable-type.enum';
import { EntityType } from 'src/app/policy/models/entity-type.enum';
import { Workflow, WorkflowStep } from 'src/app/workflow/models';
import { WorkflowActivitySendVisibility, WorkflowButtonEvent } from 'src/app/workflow/workflow-shared/workflow-button-group/models';
import { WorkflowButtonGroupService } from 'src/app/workflow/workflow-shared/workflow-button-group/services/workflow-button-group.service';
import { AppFileManagerService } from '../../app-file-manager/app-file-manager.service';
import { BasicValueType } from '../../basicinfo/basic-value/basic-value.model';
import { ExpertPerson, PersonType, RelationType, ServiceStatus } from '../expert-person.model';
import { ExpertPersonService } from '../expert-person.service';

@Component({
  selector: 'app-expert-person-edit',
  templateUrl: './expert-person-edit.component.html',
  styleUrls: ['./expert-person-edit.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class ExpertPersonEditComponent extends BaseComponent implements OnInit {

  relationTypes = RelationType;
  serviceStatuses = ServiceStatus;
  expertPerson: ExpertPerson;
  personTypes = PersonType;
  displayPersonSearch: boolean;

  personImageFile: any;
  personImageFileUrl: any = '../../../../assets/img/user1.jpg';
  educationImageFile: any;
  attachmentFile: any;

  activityId: number;
  wfTaskId: any;
  activityType: any;
  senderUserId: number;

  private _location: Location;

  get fullName(): string { return this.expertPerson?.firstName + ' ' + this.expertPerson?.lastName }

  selectedPerson: Person_;
  category: Orgunit;

  formFiles: FormFile[] = [];

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private expertPersonService: ExpertPersonService,
    private activityService: ActivityService,
    private activatedRoute: ActivatedRoute,
    private elementRef: ElementRef,
    private workflowButtonGroupService: WorkflowButtonGroupService,
    public appFileManager: AppFileManagerService,
    private personService: PersonService,
    private sanitizer: DomSanitizer) {
    super();

    this._location = location;
  }

  ngOnInit(): void {
    this.createForm();

    this.activatedRoute.paramMap.subscribe(p => {
      var id = +p.get('id');

      this.activityId = +p.get('aid');
      this.wfTaskId = p.get('wfTaskId');
      this.activityType = p.get('activityType');
      this.senderUserId = +p.get('senderUserId');

      this.expertPersonService.getExpertPerson(id).subscribe(res => {
        this.expertPerson = res;

        if (!this.expertPerson) {
          this.warningNotify({ detail: 'اطلاعاتی وجود ندارد', summary: "اخطار" });
          this.onBack();
        }

        this.workflowButtonGroupService.setEditButtonDisabled(this.expertPerson?.status?.code == '4' || this.expertPerson?.status?.code == '5');
        this.workflowButtonGroupService.setSendButtonDisabled(this.expertPerson?.status?.code == '4' || this.expertPerson?.status?.code == '5');

        this.updateForm();

        this.personType.valueChanges.subscribe(personType => {
          this.createForm();
        });
      }, error => {
        this.handleError(error);
      });
    });
  }

  get internalPersonType() { return this.personType.value == PersonType.INTERNAL; }
  get externalPersonType() { return this.personType.value == PersonType.EXTERNAL; }

  get attachmentFileName() { return this.attachmentFile instanceof File ? this.attachmentFile?.name : this.expertPerson?.attachment?.fileName }
  get educationImageFileName() { return this.educationImageFile instanceof File ? this.educationImageFile?.name : this.expertPerson?.educationImage?.fileName }

  get id() { return this.form.get('id'); }
  get categoryId() { return this.form.get('categoryId'); }
  get personType() { return this.form.get('personType'); }
  get personId() { return this.form.get('personId'); }
  get personnelCode() { return this.form.get('personnelCode'); }
  get nationalCode() { return this.form.get('nationalCode'); }
  get firstName() { return this.form.get('firstName'); }
  get lastName() { return this.form.get('lastName'); }
  get fatherName() { return this.form.get('fatherName'); }
  get birthDate() { return this.form.get('birthDate'); }
  get educationDegreeId() { return this.form.get('educationDegreeId'); }
  get studyFieldId() { return this.form.get('studyFieldId'); }
  get relation() { return this.form.get('relation'); }
  get serviceStatus() { return this.form.get('serviceStatus'); }
  get serviceLocationId() { return this.form.get('serviceLocationId'); }
  get degreeId() { return this.form.get('degreeId'); }
  get employmentDate() { return this.form.get('employmentDate'); }
  get currentResponsibility() { return this.form.get('currentResponsibility'); }
  get threePreviousPosition() { return this.form.get('threePreviousPosition'); }
  get scientificExperiencesRecords() { return this.form.get('scientificExperiencesRecords'); }
  get accountNumber() { return this.form.get('accountNumber'); }
  get shabaNumber() { return this.form.get('shabaNumber'); }
  // personImage: ['', ],
  get educationImage() { return this.form.get('educationImage'); }
  // attachment: [''],
  get description() { return this.form.get('description'); }
  get inactive() { return this.form.get('inactive'); }
  get status() { return this.form.get('status'); }

  createForm() {
    this.form = this.formBuilder.group({
      id: ['', [Validators.required]],
      categoryId: [null, [Validators.required]],
      personType: [PersonType.EXTERNAL, [Validators.required]],
      personId: [null, Validators.required],
      personnelCode: ['', [Validators.required]],
      nationalCode: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      fatherName: ['', [Validators.required]],
      birthDate: [null, [Validators.required]],
      educationDegreeId: [null, [Validators.required]],
      studyFieldId: [null, [Validators.required]],
      relation: [RelationType.military, [Validators.required]],
      serviceStatus: [ServiceStatus.employed, [Validators.required]],
      serviceLocationId: [null, [Validators.required]],
      degreeId: [null, [Validators.required]],
      employmentDate: [null],
      currentResponsibility: ['', [Validators.required]],
      threePreviousPosition: [''],
      scientificExperiencesRecords: [''],
      accountNumber: ['', [Validators.required]],
      shabaNumber: ['', [Validators.required]],
      // personImage: ['', ],
      educationImage: [null, [Validators.required]],
      // attachment: [''],
      description: [''],
      inactive: false,
      status: null
    });

    this.createButtons();
  }

  createButtons() {
    this.workflowButtonGroupService.clearButtons();
    this.workflowButtonGroupService.addEditButton(({ srcElementEvent }: { srcElementEvent: any }): void => { this.onSubmit(); });
    this.workflowButtonGroupService.addBackButton((): void => { this.onBack(); });
    this.workflowButtonGroupService.addSubmitAndSendButton({
      showCreateActivity: true,
      onClick: (event: WorkflowButtonEvent): void => {
        this.onSubmitSend(event.activity);
      }
    });

    this.workflowButtonGroupService.setWorkFlowInfo({ workflow: Workflow.ExpertPerson, workflowStep: WorkflowStep.Edit });
    this.workflowButtonGroupService.editButtonCheckFormInvalid(this.form);
    this.workflowButtonGroupService.submitAndSendButtonCheckFormInvalid(this.form);
    this.workflowButtonGroupService.checkPolicy(EntityType.expertPerson);
    this.workflowButtonGroupService.setShowCreateActivityVisibility(new WorkflowActivitySendVisibility({ priorityId: false, classificationId: false, deadline: false }));
  }

  updateForm() {
    var pType = PersonType[this.expertPerson.personType];
    this.personType.setValue(pType);
    this.personId.setValue(this.expertPerson.personId);
    this.personnelCode.setValue(this.expertPerson.personnelCode);
    this.nationalCode.setValue(this.expertPerson.nationalCode);
    this.firstName.setValue(this.expertPerson.firstName);
    this.lastName.setValue(this.expertPerson.lastName);
    this.fatherName.setValue(this.expertPerson.fatherName);

    if (this.expertPerson.birthDate) {
      var birthDateTemp = this.expertPerson.birthDate.toString();
      var birthDate = new Date(Date.UTC(+birthDateTemp.split('T')[0].split('-')[0], +birthDateTemp.split('T')[0].split('-')[1] - 1, +birthDateTemp.split('T')[0].split('-')[2]));

      this.birthDate.setValue(birthDate);
    }

    this.educationDegreeId.setValue(this.expertPerson.educationDegreeId);
    this.studyFieldId.setValue(this.expertPerson.studyFieldId);
    this.relation.setValue(RelationType[this.expertPerson.relation.toString().toLowerCase()]);
    this.serviceStatus.setValue(ServiceStatus[this.expertPerson.serviceStatus.toString().toLowerCase()]);
    this.serviceLocationId.setValue(this.expertPerson.serviceLocationId);
    this.degreeId.setValue(this.expertPerson.degreeId);

    if (this.expertPerson.employmentDate) {
      var employmentDateTemp = this.expertPerson.employmentDate.toString();
      var employmentDate = new Date(Date.UTC(+employmentDateTemp.split('T')[0].split('-')[0], +employmentDateTemp.split('T')[0].split('-')[1] - 1, +employmentDateTemp.split('T')[0].split('-')[2]));

      this.employmentDate.setValue(employmentDate);
    }

    this.currentResponsibility.setValue(this.expertPerson.currentResponsibility);
    this.threePreviousPosition.setValue(this.expertPerson.threePreviousPosition);
    this.scientificExperiencesRecords.setValue(this.expertPerson.scientificExperiencesRecords);
    this.accountNumber.setValue(this.expertPerson.accountNumber);
    this.shabaNumber.setValue(this.expertPerson.shabaNumber);
    // this.personImage: ['', ],
    this.educationImage.setValue(this.expertPerson.educationImageId);
    // this.attachment: [''],
    this.description.setValue(this.expertPerson.description);
    this.inactive.setValue(this.expertPerson.inactive);
    this.status.setValue(this.expertPerson.status);

    if (this.expertPerson.personImageId) {
      this.appFileManager.getFile(this.expertPerson.personImageId).subscribe(async (res) => {

        this.expertPerson.personImage = res;
        let objectURL = `data:${res.dataContentType};base64,` + res.data;

        this.personImageFileUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        this.personImageFile = await this.appFileManager.convertToFile(objectURL, this.expertPerson.personImage);
        this.setFormFiles(this.personImageFile, 'personImage');
      }, error => { this.handleError(error); });
    }

    if (this.expertPerson.educationImageId) {
      this.appFileManager.getFile(this.expertPerson.educationImageId).subscribe(async (res) => {

        this.expertPerson.educationImage = res;
        this.educationImageFile = `data:${res.dataContentType};base64,` + res.data;

        this.educationImageFile = await this.appFileManager.convertToFile(this.educationImageFile, this.expertPerson.educationImage);
        this.setFormFiles(this.educationImageFile, 'educationImage');
      }, error => { this.handleError(error); });
    }

    if (this.expertPerson.attachmentId) {
      this.appFileManager.getFile(this.expertPerson.attachmentId).subscribe(async (res) => {

        this.expertPerson.attachment = res;
        this.attachmentFile = `data:${res.dataContentType};base64,` + res.data;

        this.attachmentFile = await this.appFileManager.convertToFile(this.attachmentFile, this.expertPerson.attachment);
        this.setFormFiles(this.attachmentFile, 'attachment');
      }, error => { this.handleError(error); });
    }

    this.id.setValue(this.expertPerson.id);
    this.categoryId.setValue(this.expertPerson.categoryId);
    this.orgUnitService.getOrgUnit(this.categoryId?.value).subscribe(orgUnit => {
      this.category = orgUnit;
    }, error => {
      console.error(error);
    });
  }

  handleError(error: any) {
    console.error(error);
  }

  getBasicValueType(basicValueType: string) {
    return BasicValueType[basicValueType];
  }

  setFormFiles(file: File, controlName: string) {
    this.formFiles = this.formFiles.filter(x => x.name !== controlName);
    this.formFiles.push({
      name: controlName,
      file: file
    });
  }

  onUpload(event: any, controlName: string) {
    if (event.target.files && event.target.files[0]) {

      this.formFiles = this.formFiles.filter(x => x.name !== controlName);
      this.formFiles.push({
        name: controlName,
        file: event.target.files[0]
      });

      if (controlName == 'personImage') {
        this.personImageFile = event.target.files[0];
        var reader = new FileReader();
        reader.onload = (imageEvent: any) => {
          this.personImageFileUrl = imageEvent.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
      } else if (controlName == 'educationImage') {
        this.educationImageFile = event.target.files[0];
      } else if (controlName == 'attachment') {
        this.attachmentFile = event.target.files[0];
      }
    }

    event.srcElement.value = null;
  }

  onRemoveUpload(controlName: string) {
    if (controlName == 'personImage') {
      this.personImageFile = null;
      this.personImageFileUrl = '../../../assets/img/user1.jpg';
    } else if (controlName == 'educationImage') {
      this.educationImageFile = null;
      this.educationImage.reset();
    } else if (controlName == 'attachment') {
      this.attachmentFile = null;
    }

    this.formFiles = this.formFiles.filter(x => x.name !== controlName);
  }

  search(controlName: string) {
    if (controlName == 'personnelCode') {
      this.displayPersonSearch = true;
    } else if ('nationalCode') {
      this.personService.getPersonByNationalCode(this.nationalCode.value).subscribe(res => {
        this.personId.setValue(res.id);
        this.personnelCode.setValue(res.personnelCode);
        this.firstName.setValue(res.firstName);
        this.lastName.setValue(res.lastName);
        this.fatherName.setValue(res.fatherName);
        this.birthDate.setValue(res.birthDate);
      });
    }
  }

  selectPerson(person: Person_) {
    this.selectedPerson = person;
    this.personId.setValue(person.id);
    this.personnelCode.setValue(person?.personnelCode);
    this.firstName.setValue(person?.firstName);
    this.lastName.setValue(person?.lastName);
    this.fatherName.setValue(person?.fatherName);
    this.birthDate.setValue(person?.birthDate);
    this.nationalCode.setValue(person?.nationalCode)
    this.educationDegreeId.setValue(person?.educationDegreeId);
    this.serviceLocationId.setValue(person?.organizationId);
    this.employmentDate.setValue(person?.employmentDate);
    this.degreeId.setValue(person?.rankId);
  }

  searchByPersonnelCode() {
    this.personService.getPersonByPersonnelCode(this.personnelCode.value).subscribe(res => {
      this.selectPerson(res);
    });
  }

  onBack() {
    this._location.back();
  }

  searchServiceLocation() {
    console.log("searchServiceLocation");
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.workflowButtonGroupService.loading();
    this.expertPersonService.put(this.form.value, this.formFiles).subscribe(res => {
      this.workflowButtonGroupService.unLoading();
      this.successNotify({ detail: 'عملیات ویرایش با موفقیت انجام شد', summary: 'عملیات موفق' });
      this.onBack();
    }, error => {
      this.workflowButtonGroupService.unLoading();
      console.error(error);
      if (error.error?.nationalcode == 'duplicate') {
        this.errorNotify({ detail: 'امکان ویرایش وجود ندارد! فرد خبره تکراری می باشد.', summary: 'رخداد خطا' });
      } else {
        this.errorNotify();
      }
    });
  }

  onSubmitSend(activity: ActivitySend) {
    if (this.form.invalid) {
      return;
    }

    this.workflowButtonGroupService.loading();
    this.expertPersonService.put(this.form.value, this.formFiles).subscribe(res => {
      this.successNotify({ detail: 'عملیات ویرایش با موفقیت انجام شد', summary: 'عملیات موفق' });
      this.send(activity, res);
      this.onBack();
    }, error => {
      this.workflowButtonGroupService.unLoading();
      if (error.error?.nationalcode == 'duplicate') {
        this.errorNotify({ detail: 'امکان ویرایش وجود ندارد! فرد خبره تکراری می باشد.', summary: 'رخداد خطا' });
      } else {
        this.errorNotify();
      }
    });
  }

  send(activityInput: ActivitySend, expertPerson: ExpertPerson) {
    console.log('start process expertPerson: ', expertPerson);

    var obj: ActivityObject =
    {
      name: 'ExpertPerson',
      objectType: 'ExpertPerson',
      objectId: expertPerson.id
    }

    var activity: ActivitySend =
    {
      sendType: this.activityId ? SendType.SENDBACK : SendType.COMPOSE,
      text: activityInput?.text,
      subject: activityInput?.subject,
      classificationId: activityInput?.classificationId,
      priorityId: activityInput?.priorityId,
      deadline: activityInput?.deadline,
      activityObject: obj,

      // receivers: [this.senderUserId]
    };

    var activityStart: ActivitySend =
    {
      sendType: this.activityId ? SendType.SENDBACK : SendType.COMPOSE,
      text: activityInput?.text,
      subject: activityInput?.subject,
      activityObject: obj
    };

    var startProcessInstanceBody = <StartProcessInstanceBody>{
      businessKey: expertPerson.id.toString(),
      variables: {
        approved: { value: true, type: WorkflowVariableType[WorkflowVariableType.Boolean] },
        formName: { value: "ExpertPerson.Create", type: WorkflowVariableType[WorkflowVariableType.String] },
        unitId: { value: this.currentUser.orgUnit.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        userId: { value: this.currentUser.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        taskId: { value: this.wfTaskId, type: WorkflowVariableType[WorkflowVariableType.String] }
      }
    };

    if (this.activityId) {
      this.activityService.completeProcess(activity, startProcessInstanceBody, this.activityId).subscribe(res => {
        this.successNotify({ detail: 'ادامه فرآیند فرد خبره', summary: 'عملیات موفق' });
      }, error => {
        this.errorNotify({ detail: 'خطا در ادامه فرآیند فرد خبره', summary: 'رخداد خطا' });
        console.log(error);
      });
    } else {
      this.activityService.startProcess(activityStart, startProcessInstanceBody, 'Process_ExpertRegistration_withEvent').subscribe(res => {
        this.successNotify({ detail: 'شروع فرآیند فرد خبره', summary: 'عملیات موفق' });
      }, error => {
        this.errorNotify({ detail: 'خطا در شروع فرآیند فرد خبره', summary: 'رخداد خطا' });
        console.log(error);
      });
    }
  }

}
