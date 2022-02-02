import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppFileManagerService } from 'src/app/app-file-manager/app-file-manager.service';
import { BasicValue, BasicValueType } from 'src/app/basicinfo/basic-value/basic-value.model';
import { BasicValueService } from 'src/app/basicinfo/basic-value/basic-value.service';
import { EntityType } from 'src/app/policy/models/entity-type.enum';
import { WorkflowButtonEvent } from 'src/app/workflow/workflow-shared/workflow-button-group/models';
import { BaseComponent } from '../../../app-shared/base/base.component';
import { ActivityObject, ActivitySend, SendType } from '../../../cartable-new/models';
import { StartProcessInstanceBody } from '../../../cartable-new/models/start-process-instance-body';
import { ActivityService } from '../../../cartable-new/services/activity.service';
import { WorkflowVariableType } from '../../../cartable/models/workflow-variable-type.enum';
import { WorkflowButton } from '../../../workflow/workflow-shared/workflow-button-group/models/workflow-button';
import { WorkflowButtonGroupService } from '../../../workflow/workflow-shared/workflow-button-group/services/workflow-button-group.service';
import { RegulationCertificateService } from '../regulations-certificate/regulation-certificate.service';
import { RegulationsCertificate } from '../regulations-certificate/regulations-certificate.model';
import { NajaExpertsSession, NajaExpertsSessionView } from './models/naja-experts-session';
import { NajaExpertsSessionService } from './services/naja-experts-session.service';

@Component({
  selector: 'app-naja-experts-session',
  templateUrl: './naja-experts-session.component.html',
  styleUrls: ['./naja-experts-session.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class NajaExpertsSessionComponent extends BaseComponent implements OnInit {

  selectedBasicValueType: BasicValue;
  loading: boolean;
  attachmentFile: File;
  najaExpertSession: NajaExpertsSession;
  confirmationRfpValue: BasicValue[] = [];
  selectedConfirmationRfp: any;
  confirmationProposalValue: BasicValue[] = [];
  selectedConfirmationProposal: any;
  confirmationTeamValue: BasicValue[] = [];
  selectedConfirmationTeam: any;
  sessionTypeValue: BasicValue[] = [];
  editMode = false;
  certificate: RegulationsCertificate;
  formBuilder: any;
  activityId: number;
  wfTaskId: any;
  activityType: any;
  sessionId: number;
  actionTranslate: any;
  buttons: WorkflowButton[] = [];
  isCartable = false;
  certificateId: number;
  confirmationStatus: boolean;

  // tslint:disable-next-line:variable-name
  private _location: Location;

  constructor(
    private location: Location,
    private workflowButtonGroupService: WorkflowButtonGroupService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public appFileManager: AppFileManagerService,
    private najaExpertsSessionService: NajaExpertsSessionService,
    private basicValueService: BasicValueService,
    private activityService: ActivityService,
    private regulationCertificateService: RegulationCertificateService
  ) {
    super();
    this.basicValueService.getBasicInfo(BasicValueType.najaExpertsSessionType).subscribe(bi => {
      this.sessionTypeValue = bi.children;
    });
    this._location = location;
  }

  ngOnInit(): void {
    this.createForm();
    this.radioButtonValue();
    this.activatedRoute.paramMap.subscribe(p => {
      const id = +p.get('id');
      if (!id) {
        this.warningNotify({ detail: 'ابتدا باید شناسنامه آیین نامه را ثبت نمایید', summary: 'اخطار !' });
        this.router.navigate(['../', 'certificate'], { relativeTo: this.activatedRoute });
        this.buttons = null;
        return;
      }
      this.certificateId = id;
      this.activityId = +p.get('aid');
      this.wfTaskId = p.get('wfTaskId');
      this.activityType = p.get('activityType');
      this.sessionId = +p.get('sessionId');
    });
    if (this.certificateId) {
      this.loadData();
    }
  }

  loadData() {
    this.regulationCertificateService.getCertificate(this.certificateId).subscribe(cert => {
      this.certificate = cert;
      this.najaExpertsSessionService.getSession(this.sessionId).subscribe(res => {
        this.najaExpertSession = res;
        this.updateForm();
        this.editMode = true;
        this.createButton();
      }, error => {
        console.error(error);
        this.editMode = false;
        this.createButton();
      });
      if (this.activityId) {
        this.isCartable = true;
      }
    }, error => {
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [null],
      sessionTypeId: [BasicValueType.najaExpertSessionTypeSelected, Validators.compose([Validators.required])],
      sessionTitle: ['', Validators.compose([Validators.required])],
      sessionSubject: ['', Validators.compose([Validators.required])],
      sessionDate: [null, Validators.compose([Validators.required])],
      startTime: ['00:00', Validators.compose([Validators.required])],
      endTime: ['00:00', Validators.compose([Validators.required])],
      sessionNo: ['', Validators.compose([Validators.required])],
      invitationNo: ['', Validators.compose([Validators.required])],
      sessionPlace: ['', Validators.compose([Validators.required])],
      sessionCoordinator: ['', Validators.compose([Validators.required])],
      sessionSummary: ['', Validators.compose([Validators.required])],
      confirmationDescriptionRfp: [''],
      confirmationDescriptionTeam: [''],
      confirmationDescriptionProposal: [''],
      confirmationStatusRfpID: [null, Validators.compose([Validators.required])],
      confirmationStatusTeamID: [null, Validators.compose([Validators.required])],
      confirmationStatusProposalID: [null, Validators.compose([Validators.required])],
      attachmentId: [null],
      enactments: [null],
      sessionMembers: [null]
    });
  }

  updateForm() {
    this.id.setValue(this.najaExpertSession.id);
    this.sessionTypeId.setValue(this.najaExpertSession.sessionTypeId);
    this.sessionTitle.setValue(this.najaExpertSession.sessionTitle);
    this.sessionSubject.setValue(this.najaExpertSession.sessionSubject);
    this.sessionDate.setValue(this.najaExpertSession.sessionDate);
    this.startTime.setValue(this.najaExpertSession.startTime.replace(':', ''));
    this.endTime.setValue(this.najaExpertSession.endTime.replace(':', ''));
    this.sessionNo.setValue(this.najaExpertSession.sessionNo);
    this.invitationNo.setValue(this.najaExpertSession.invitationNo);
    this.sessionPlace.setValue(this.najaExpertSession.sessionPlace);
    this.sessionCoordinator.setValue(this.najaExpertSession.sessionCoordinator);
    this.sessionSummary.setValue(this.najaExpertSession.sessionSummary);
    this.confirmationDescriptionRfp.setValue(this.najaExpertSession.confirmationDescriptionRfp);
    this.confirmationDescriptionTeam.setValue(this.najaExpertSession.confirmationDescriptionTeam);
    this.confirmationDescriptionProposal.setValue(this.najaExpertSession.confirmationDescriptionProposal);
    this.confirmationStatusRfpID.setValue(this.najaExpertSession.confirmationStatusRfpID);
    this.confirmationStatusTeamID.setValue(this.najaExpertSession.confirmationStatusTeamID);
    this.confirmationStatusProposalID.setValue(this.najaExpertSession.confirmationStatusProposalID);
    this.attachmentId.setValue(this.najaExpertSession.attachmentId);
    this.certificateId = this.najaExpertSession.certificateId;
    this.sessionMembers.setValue(this.najaExpertSession.sessionMembers);
    this.enactments.setValue(this.najaExpertSession.enactments);

    if (this.najaExpertSession.attachment?.id) {
      this.appFileManager.getFile(this.najaExpertSession.attachment.id).subscribe(async (res) => {

        this.najaExpertSession.attachment = res;
        const attachmentFileData = `data:${res.dataContentType};base64,` + res.data;

        this.attachmentFile = await this.appFileManager.convertToFile(attachmentFileData, this.najaExpertSession.attachment);
      });
    }
  }

  radioButtonValue() {
    this.basicValueService.getBasicInfo(BasicValueType.confirmationStatusTeam).subscribe(basicValue => {
      this.confirmationRfpValue = basicValue.children;
      this.confirmationTeamValue = basicValue.children;
      this.confirmationProposalValue = basicValue.children;
      this.confirmationRfpValue.sort((a, b) => a.viewOrder > b.viewOrder ? 1 : -1);
      this.selectedConfirmationRfp = this.confirmationRfpValue[0].id;
      this.selectedConfirmationTeam = this.confirmationTeamValue[0].id;
      this.selectedConfirmationProposal = this.confirmationProposalValue[0].id;
    });
    // this.basicValueService.getBasicInfo(BasicValueType.confirmationStatusTeam).subscribe(bi => {
    //   this.confirmationTeamValue = bi.children;
    //   this.confirmationTeamValue.sort((a, b) => a.viewOrder > b.viewOrder ? 1 : -1);
    //   this.selectedConfirmationTeam = this.confirmationTeamValue[0].id;
    // });
    // this.basicValueService.getBasicInfo(BasicValueType.confirmationStatusTeam).subscribe(bi => {
    //   this.confirmationProposalValue = bi.children;
    //   this.confirmationProposalValue.sort((a, b) => a.viewOrder > b.viewOrder ? 1 : -1);
    //   this.selectedConfirmationProposal = this.confirmationProposalValue[0].id;
    // });
  }

  getBasicValueType(basicValueType: string) {
    return BasicValueType[basicValueType];
  }

  selectBasicValueType(event: BasicValue) {
    this.selectedBasicValueType = event;
  }

  onDelete(rowNode: NajaExpertsSessionView) {
    console.log('delete', rowNode);
  }

  onSubmit() {
    this.workflowButtonGroupService.loading();
    const input = {
      sessionTypeId: this.sessionTypeId.value,
      sessionTitle: this.sessionTitle.value,
      sessionSubject: this.sessionSubject.value,
      sessionDate: this.sessionDate.value,
      startTime: this.startTime.value,
      endTime: this.endTime.value,
      sessionNo: this.sessionNo.value,
      invitationNo: this.invitationNo.value,
      sessionPlace: this.sessionPlace.value,
      sessionCoordinator: this.sessionCoordinator.value,
      sessionSummary: this.sessionSummary.value,
      confirmationStatusRfpID: this.confirmationStatusRfpID.value,
      confirmationStatusTeamID: this.confirmationStatusTeamID.value,
      confirmationStatusProposalID: this.confirmationStatusProposalID.value,
      confirmationDescriptionRfp: this.confirmationDescriptionRfp.value,
      confirmationDescriptionTeam: this.confirmationDescriptionTeam.value,
      confirmationDescriptionProposal: this.confirmationDescriptionProposal.value,
      certificateId: this.certificateId,
      enactments: this.enactments.value,
      sessionMembers: this.sessionMembers.value,
    } as NajaExpertsSession;

    if (this.editMode) {
      this.najaExpertsSessionService.update(input, this.attachmentFile).subscribe(res => {
        this.successNotify({ detail: 'ویرایش انجام شد', summary: 'عملیات موفق' });
        this.workflowButtonGroupService.unLoading();
      }, error => {
        this.errorNotify({ detail: 'رخداد خطا در عملیات ویرایش مصوبه', summary: 'رخداد خطا' });
        this.workflowButtonGroupService.unLoading();
      });
    } else {
      this.najaExpertsSessionService.save(input, this.attachmentFile).subscribe(res => {
        this.successNotify({ detail: 'عملیات ثبت با موفقیت انجام شد', summary: 'عملیات موفق' });
        this.workflowButtonGroupService.unLoading();
        this.sessionId = res.id;
        this.loadData()
      }, error => {
        this.errorNotify({ detail: 'رخداد خطا در عملیات ایجاد مصوبه', summary: 'رخداد خطا' });
        this.workflowButtonGroupService.unLoading();
      });
    }
  }

  send(activityText: string) {
    const item = this.confirmationRfpValue.find(x => x.code === '1');
    if (this.najaExpertSession.confirmationStatusRfpID === item.id && this.najaExpertSession.confirmationStatusProposalID == item.id &&
      this.najaExpertSession.confirmationStatusTeamID === item.id) {
      this.confirmationStatus = true;
    } else {
      this.confirmationStatus = false;
    }
    this.onSend(null);
  }

  onSend(activityText: string) {
    this.workflowButtonGroupService.loading();
    const obj: ActivityObject =
    {
      name: 'Certificate',
      objectType: 'Certificate',
      objectId: this.certificate.id
    };
    const activity: ActivitySend =
    {
      sendType: SendType.FORWARD,
      text: activityText,
      subject: this.certificate.title,
      activityObject: obj,
      // receivers: [this.currentUser.id]
    };

    const startProcessInstanceBody = {
      businessKey: this.certificate.id.toString(),
      variables: {
        approved: { value: true, type: WorkflowVariableType[WorkflowVariableType.Boolean] },
        formName: { value: 'Certificate', type: WorkflowVariableType[WorkflowVariableType.String] },
        unitId: { value: this.currentUser.orgUnit.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        userId: { value: this.currentUser.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        taskId: { value: this.wfTaskId, type: WorkflowVariableType[WorkflowVariableType.String] },
        ff_comfirmationStatus: { value: this.confirmationStatus, type: WorkflowVariableType[WorkflowVariableType.Boolean] }
      }
    } as StartProcessInstanceBody;
    this.activityService.completeProcess(activity, startProcessInstanceBody, this.activityId).subscribe(res => {
      this.workflowButtonGroupService.unLoading();
      this.successNotify({ detail: 'ارسال با موفقیت انجام گردید', summary: 'عملیات موفق' });
    }, error => {
      this.workflowButtonGroupService.unLoading();
      this.errorNotify({ detail: 'خطا هنگام ارسال', summary: 'رخداد خطا' });
    });
  }

  onCancel() {
    this.createForm();
  }

  handleError(error: any) {
    console.error(error);
  }

  onUpload(event: any, controlName: string) {
    if (event.target.files && event.target.files[0]) {
      if (controlName == 'attachment') {
        this.attachmentFile = event.target.files[0];
      }
      console.log('selectedFile', event.target.files[0]);
    }
    event.srcElement.value = null;
  }

  onRemoveUpload(controlName: string) {
    if (controlName == 'attachment') {
      this.attachmentFile = null;
    }
  }

  createButton() {
    this.workflowButtonGroupService.clearButtons();
    if (!this.editMode) {
      this.workflowButtonGroupService.addCreateButton(({ srcElementEvent }: { srcElementEvent: any }): void => {
        this.onSubmit();
      });
    } else {
      this.workflowButtonGroupService.addEditButton((): void => {
        this.onSubmit();
      });
    }
    this.workflowButtonGroupService.addBackButton((): void => {
      this.onBack();
    });
    if (this.isCartable && this.editMode) {
      this.workflowButtonGroupService.addSendButton({
        showCreateActivity: true,
        onClick: (event: WorkflowButtonEvent): void => { this.send(event.activity.text); }
      });
    }

    // this.workflowButtonGroupService.setWorkFlowInfo({ workflow: Workflow.Certificate, workflowStep: WorkflowStep. });

    this.workflowButtonGroupService.createButtonCheckFormInvalid(this.form);
    this.workflowButtonGroupService.editButtonCheckFormInvalid(this.form);

    this.workflowButtonGroupService.checkPolicy(EntityType.najaExpertsSession);
    this.workflowButtonGroupService.setEditMode(this.editMode);
  }

  onBack() {
    this._location.back();
  }

  get certificateTitle() {
    return this.certificate?.title;
  }

  get attachmentFileName() {
    return this.attachmentFile instanceof File ? this.attachmentFile?.name : '';
  }

  get id() {
    return this.form.get('id');
  }

  get sessionTypeId() {
    return this.form.get('sessionTypeId');
  }

  get sessionTitle() {
    return this.form.get('sessionTitle');
  }

  get sessionSubject() {
    return this.form.get('sessionSubject');
  }

  get sessionDate() {
    return this.form.get('sessionDate');
  }

  get startTime() {
    return this.form.get('startTime');
  }

  get endTime() {
    return this.form.get('endTime');
  }

  get sessionNo() {
    return this.form.get('sessionNo');
  }

  get invitationNo() {
    return this.form.get('invitationNo');
  }

  get sessionPlace() {
    return this.form.get('sessionPlace');
  }

  get sessionCoordinator() {
    return this.form.get('sessionCoordinator');
  }

  get sessionSummary() {
    return this.form.get('sessionSummary');
  }

  get confirmationDescriptionRfp() {
    return this.form.get('confirmationDescriptionRfp');
  }

  get confirmationDescriptionTeam() {
    return this.form.get('confirmationDescriptionTeam');
  }

  get confirmationDescriptionProposal() {
    return this.form.get('confirmationDescriptionProposal');
  }

  get confirmationStatusRfpID() {
    return this.form.get('confirmationStatusRfpID');
  }

  get confirmationStatusTeamID() {
    return this.form.get('confirmationStatusTeamID');
  }

  get confirmationStatusProposalID() {
    return this.form.get('confirmationStatusProposalID');
  }

  get attachmentId() {
    return this.form.get('attachmentId');
  }

  get enactments() {
    return this.form.get('enactments');
  }

  get sessionMembers() {
    return this.form.get('sessionMembers');
  }


}
