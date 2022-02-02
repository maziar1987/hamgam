import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppFileManagerService } from 'src/app/app-file-manager/app-file-manager.service';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { FormFile } from 'src/app/app-shared/base/form-file';
import { OrgUnit } from 'src/app/basicinfo/org-unit/models/org-unit';
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
import { BasicValueType } from '../../basicinfo/basic-value/basic-value.model';
import { ExpertPerson, PersonType, RelationType, ServiceStatus } from '../expert-person.model';
import { ExpertPersonService } from '../expert-person.service';


@Component({
  selector: 'app-expert-person-create',
  templateUrl: './expert-person-create.component.html',
  styleUrls: ['./expert-person-create.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class ExpertPersonCreateComponent extends BaseComponent implements OnInit {

  relationTypes = RelationType;
  serviceStatuses = ServiceStatus;
  personTypes = PersonType;
  displayPersonSearch: boolean;

  personImageFile: any;
  personImageFileUrl: any = '../../../assets/img/user1.jpg';
  educationImageFile: any;
  attachmentFile: any;

  selectedPerson: Person_;
  category: Orgunit;
  serviceLocation: OrgUnit | null = null;

  formFiles: FormFile[] = [];

  private _location: Location;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    public appFileManager: AppFileManagerService,
    private personService: PersonService,
    private workflowButtonGroupService: WorkflowButtonGroupService,
    private expertPersonService: ExpertPersonService,
    private activityService: ActivityService
  ) {
    super();

    this._location = location;
  }

  ngOnInit(): void {
    this.createForm();
    this.createButtons();

    this.category = this.currentUser?.orgUnit;
    this.categoryId.setValue(this.currentUser?.orgUnit?.id);
  }

  get internalPersonType() { return this.personType.value == PersonType.INTERNAL; }
  get externalPersonType() { return this.personType.value == PersonType.EXTERNAL; }
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

  private createForm() {
    this.form = this.fb.group({
      categoryId: [null, [Validators.required]],
      personType: [PersonType.INTERNAL, [Validators.required]],
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
      serviceLocationId: [null],
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
      inactive: false
    });
  }

  createButtons() {
    this.workflowButtonGroupService.addCreateButton(({ srcElementEvent }: { srcElementEvent: any }): void => { this.onSubmit(); });
    this.workflowButtonGroupService.addBackButton((): void => { this.back(); });
    this.workflowButtonGroupService.addSubmitAndSendButton({
      showCreateActivity: true,
      onClick: (event: WorkflowButtonEvent): void => {
        this.onSubmitSend(event.activity);
      }
    });

    this.workflowButtonGroupService.setWorkFlowInfo({ workflow: Workflow.ExpertPerson, workflowStep: WorkflowStep.Create });
    this.workflowButtonGroupService.createButtonCheckFormInvalid(this.form);
    this.workflowButtonGroupService.submitAndSendButtonCheckFormInvalid(this.form);
    this.workflowButtonGroupService.checkPolicy(EntityType.expertPerson);
    this.workflowButtonGroupService.setShowCreateActivityVisibility(new WorkflowActivitySendVisibility({ priorityId: false, classificationId: false, deadline: false }));
  }

  back() {
    this._location.back();
  }

  getBasicValueType(basicValueType: string) {
    return BasicValueType[basicValueType];
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
        reader.onload = (loadEvent: any) => {
          this.personImageFileUrl = loadEvent.target.result;
        };
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
    this.nationalCode.setValue(person?.nationalCode);
    this.educationDegreeId.setValue(person?.educationDegreeId);
    this.studyFieldId.setValue(person.studyFieldId);
    this.serviceLocationId.setValue(person?.organizationId);
    this.orgUnitService.getOrgUnit(person?.organizationId).subscribe(res => {
      this.serviceLocation = res;
    }, error => {
      console.error(error);
      this.errorNotify({ detail: 'خطا در دریافت محل خدمت', summary: 'رخداد خطا' });
    });
    this.employmentDate.setValue(person?.employmentDate);
    this.degreeId.setValue(person?.rankId);
  }

  searchByPersonnelCode() {
    this.personService.getPersonByPersonnelCode(this.personnelCode.value).subscribe(res => {
      this.selectPerson(res);
    });
  }

  searchServiceLocation() {
    console.log('searchServiceLocation');
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.workflowButtonGroupService.loading();
    this.expertPersonService.post(this.form.value, this.formFiles).subscribe(res => {
      this.workflowButtonGroupService.unLoading();
      this.successNotify({ detail: 'عملیات ثبت با موفقیت انجام شد', summary: 'عملیات موفق' });
      this.back();
    }, error => {
      this.workflowButtonGroupService.unLoading();
      console.error(error);
      if (error.error?.nationalcode == 'duplicate') {
        this.errorNotify({ detail: 'امکان ثبت وجود ندارد! فرد خبره تکراری می باشد.', summary: 'رخداد خطا' });
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
    this.expertPersonService.post(this.form.value, this.formFiles).subscribe(res => {
      this.successNotify({ detail: 'عملیات ثبت با موفقیت انجام شد', summary: 'عملیات موفق' });
      this.send(activity, res);
      this.back();
    }, error => {
      this.workflowButtonGroupService.unLoading();
      if (error.error?.nationalcode == 'duplicate') {
        this.errorNotify({ detail: 'امکان ثبت وجود ندارد! فرد خبره تکراری می باشد.', summary: 'رخداد خطا' });
      } else {
        this.errorNotify();
      }
    });
  }

  send(activityInput: ActivitySend, expertPerson: ExpertPerson) {
    const obj: ActivityObject =
    {
      name: 'ExpertPerson',
      objectType: 'ExpertPerson',
      objectId: expertPerson.id
    };

    const activity: ActivitySend =
    {
      sendType: SendType.COMPOSE,
      text: activityInput?.text,
      subject: activityInput?.subject,
      classificationId: activityInput?.classificationId,
      priorityId: activityInput?.priorityId,
      activityObject: obj
    };

    const startProcessInstanceBody: StartProcessInstanceBody = {
      businessKey: expertPerson.id.toString(),
      variables: {
        approved: { value: true, type: WorkflowVariableType[WorkflowVariableType.Boolean] },
        formName: { value: 'ExpertPerson.Create', type: WorkflowVariableType[WorkflowVariableType.String] },
        unitId: { value: this.currentUser.orgUnit.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        userId: { value: this.currentUser.id, type: WorkflowVariableType[WorkflowVariableType.Integer] }
      }
    };

    this.workflowButtonGroupService.loading();
    this.activityService.startProcess(activity, startProcessInstanceBody, 'Process_ExpertRegistration_withEvent').subscribe(res => {
      this.workflowButtonGroupService.unLoading();
      this.successNotify({ detail: 'درخواست بررسی فرد خبره ایجاد شد و توسط ناظر در حال بررسی می باشد', summary: 'عملیات موفق' });
    }, error => {
      this.workflowButtonGroupService.unLoading();
      this.errorNotify({ detail: 'خطا در شروع فرآیند فرد خبره', summary: 'رخداد خطا' });
      console.log(error);
    });
  }

}
