import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng';
import { AppFileManagerService } from 'src/app/app-file-manager/app-file-manager.service';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { ActivityObject, ActivitySend, SendType } from 'src/app/cartable-new/models';
import { StartProcessInstanceBody } from 'src/app/cartable-new/models/start-process-instance-body';
import { ActivityService } from 'src/app/cartable-new/services/activity.service';
import { WorkflowVariableType } from 'src/app/cartable/models/workflow-variable-type.enum';
import { EntityType } from 'src/app/policy/models/entity-type.enum';
import { WorkflowButtonEvent } from 'src/app/workflow/workflow-shared/workflow-button-group/models';
import { WorkflowButton } from '../../../../workflow/workflow-shared/workflow-button-group/models/workflow-button';
import { WorkflowButtonGroupService } from '../../../../workflow/workflow-shared/workflow-button-group/services/workflow-button-group.service';
import { RegulationCertificateService } from '../../regulations-certificate/regulation-certificate.service';
import { RfpAttachFileComponent } from '../rfp-attach-file/rfp-attach-file.component';
import { Attachment, certificate, RFP } from '../rfp.model';
import { RfpService } from '../rfp.service';

@Component({
  selector: 'app-rfp',
  templateUrl: './rfp-create.component.html',
  styleUrls: ['./rfp-create.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class RfpCreateComponent extends BaseComponent implements OnInit {
  certificate: certificate;
  certificateId: number;
  attachments: Attachment[] = [];
  file: any;
  rfp: RFP;
  editMode = false;
  activityId: number;
  wfTaskId: any;
  activityType: any;
  actionTranslate: any;
  buttons: WorkflowButton[] = [];
  isCartable = false;

  public form: FormGroup;
  private _location: Location;

  constructor(
    private location: Location,
    private workflowButtonGroupService: WorkflowButtonGroupService,
    public appFileManager: AppFileManagerService,
    private rfpService: RfpService,
    public dialogService: DialogService,
    private fb: FormBuilder,
    private certificateService: RegulationCertificateService,
    private route: ActivatedRoute,
    private activityService: ActivityService
  ) {
    super();
    this._location = location;
  }

  ngOnInit(): void {
    this.createForm();
    this.route.paramMap.subscribe(p => {
      this.activityId = +p.get('aid');
      this.wfTaskId = p.get('wfTaskId');
      this.activityType = p.get('activityType');
      if (this.activityId) {
        this.isCartable = true;
      }
    });

    this.route.params.subscribe(params => {
      if (Object.keys(params).length !== 0) {
        this.certificateId = params.id;
      }
    });
    if (this.certificateId) {
      this.loadData(this.certificateId);
    }
  }

  loadData(certificateId: number) {
    this.certificateService.getCertificate(certificateId).subscribe(cert => {
      this.certificate = cert;
      this.rfpService.getRfpByCertificate(certificateId).subscribe(result => {
        this.rfp = result;
        this.editMode = true;
        this.updateForm();
        this.createButton();
      }, error => {
        this.editMode = false;
        this.createButton();
      });
    }, error => {
    });
  }

  onUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
    }
    event.srcElement.value = null;
  }

  createForm() {
    this.form = this.fb.group({
      preamble: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(5)]],
      mainObjective: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]],
      mainQuestion: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]],
      secondaryObjectives: [''],
      secondaryQuestions: [''],
      mission: [''],
      commands: [''],
      domain: [''],
      dependencies: [''],
      resources: [''],
      opportunities: [''],
      considerations: [''],
      regulationExecutor: [''],
      stakeholdersInternal: [''],
      stakeholdersExternal: [''],
    });
  }

  showModal() {
    const ref = this.dialogService.open(RfpAttachFileComponent, {
      header: 'افزودن فایل ضمیمه',
      closable: false,
      width: '60%',
      contentStyle: { 'max-height': '650px', overflow: 'hidden', direction: 'rtl', 'text-align': 'right' }
    });
    ref.onClose.subscribe((attach: Attachment) => {
      if (attach) {
        this.file = attach.file.data;
        attach.file = attach.file.data;
        this.attachments.push(attach);
      }
    });
  }

  onRemoveUpload() {
    this.file = null;
  }

  DeleteAttach(attach: Attachment) {
    let index: number;
    index = this.attachments.indexOf(attach);
    if (index > -1) {
      this.attachments.splice(index, 1);
    }

  }

  onSubmit() {
    if (this.form.invalid && this.editMode) {
      return;
    }
    this.workflowButtonGroupService.loading();
    const rfpData = {
      certificateId: this.certificate.id,
      preamble: this.preamble.value,
      mainObjective: this.mainObjective.value,
      mainQuestion: this.mainQuestion.value,
      secondaryObjectives: this.secondaryObjectives.value,
      secondaryQuestions: this.secondaryQuestions.value,
      mission: this.mission.value,
      commands: this.commands.value,
      domain: this.domain.value,
      dependencies: this.dependencies.value,
      resources: this.resources.value,
      opportunities: this.opportunities.value,
      considerations: this.considerations.value,
      regulationExecutor: this.regulationExecutor.value,
      stakeholdersInternal: this.stakeholdersInternal.value,
      stakeholdersExternal: this.stakeholdersExternal.value,
      attachments: this.attachments
    } as RFP;

    if (this.editMode) {
      rfpData.id = this.rfp.id;
      this.rfpService.update(rfpData).subscribe(value => {
        this.translate.get('message.update').subscribe(res => {
          this.successNotify({ detail: res.successful.successMessage, summary: res.successful.successful });
          this.workflowButtonGroupService.unLoading();
        }, error => {
          this.translate.get('message.save').subscribe(res => {
            this.errorNotify({ detail: res.unsuccessful.errorMessage, summary: res.unsuccessful.unsuccessful });
          });
          this.workflowButtonGroupService.unLoading();
        });
      });
    } else {
      this.rfpService.save(rfpData).subscribe(value => {
        this.loadData(value.certificateId);
        this.translate.get('message.save').subscribe(res => {
          this.successNotify({ detail: res.successful.successMessage, summary: res.successful.successful });
          this.workflowButtonGroupService.unLoading();
        }, error => {
          this.translate.get('message.save').subscribe(res => {
            this.errorNotify({ detail: res.unsuccessful.errorMessage, summary: res.unsuccessful.unsuccessful });
          });
          this.workflowButtonGroupService.unLoading();
        });
      });
    }
  }

  updateForm() {
    this.form.controls.preamble.setValue(this.rfp.preamble);
    this.form.controls.mainObjective.setValue(this.rfp.mainObjective);
    this.form.controls.mainQuestion.setValue(this.rfp.mainQuestion);
    this.form.controls.secondaryObjectives.setValue(this.rfp.secondaryObjectives);
    this.form.controls.secondaryQuestions.setValue(this.rfp.secondaryQuestions);
    this.form.controls.mission.setValue(this.rfp.mission);
    this.form.controls.domain.setValue(this.rfp.domain);
    this.form.controls.dependencies.setValue(this.rfp.dependencies);
    this.form.controls.resources.setValue(this.rfp.resources);
    this.form.controls.opportunities.setValue(this.rfp.opportunities);
    this.form.controls.considerations.setValue(this.rfp.considerations);
    this.form.controls.regulationExecutor.setValue(this.rfp.regulationExecutor);
    this.form.controls.stakeholdersInternal.setValue(this.rfp.stakeholdersInternal);
    this.form.controls.stakeholdersExternal.setValue(this.rfp.stakeholdersExternal);
    this.attachments = [];
    this.rfp.attachments.forEach(attachment => {
      this.attachments.push(attachment);
    });
  }

  downloadAttachment(attach: any) {
    if (attach?.id) {
      this.appFileManager.getFile(attach.id).subscribe(res => {
        this.appFileManager.convertToFile(`data:${res.dataContentType};base64,${res.data}`, attach).then(
          f => this.appFileManager.openFile(f)
        );
      });
    } else if (attach?.uploadFile) {
      this.appFileManager.openFile(attach.uploadFile);
    }
    // let file;
    // if (!attach.file){
    //   file = this.createFile(attach);
    // } else {
    //   file = attach.file.data;
    // }
    // this.appFileManager.openFile(file);
  }

  createFile(atach: any) {
    return new File([atach.data], atach.fileName, { type: atach.dataContentType });
  }

  send(activityText: string) {
    this.onSend(activityText);
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
        taskId: { value: this.wfTaskId, type: WorkflowVariableType[WorkflowVariableType.String] }
      }
    } as StartProcessInstanceBody;
    this.activityService.completeProcess(activity, startProcessInstanceBody, this.activityId).subscribe(res => {
      this.successNotify({ detail: 'شروع فرآیند آیین نامه', summary: 'عملیات موفق' });
      this.workflowButtonGroupService.unLoading();
    }, error => {
      this.errorNotify({ detail: 'خطا در شروع فرآیند آیین نامه', summary: 'رخداد خطا' });
      this.workflowButtonGroupService.unLoading();
    });
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
    this.workflowButtonGroupService.createButtonCheckFormInvalid(this.form);

    this.workflowButtonGroupService.checkPolicy(EntityType.certificate);
    this.workflowButtonGroupService.setEditMode(this.editMode);
  }

  onBack() {
    this._location.back();
  }

  get preamble() {
    return this.form.get('preamble');
  }

  get mainObjective() {
    return this.form.get('mainObjective');
  }

  get mainQuestion() {
    return this.form.get('mainQuestion');
  }

  get secondaryObjectives() {
    return this.form.get('secondaryObjectives');
  }

  get secondaryQuestions() {
    return this.form.get('secondaryQuestions');
  }

  get mission() {
    return this.form.get('mission');
  }

  get commands() {
    return this.form.get('commands');
  }

  get domain() {
    return this.form.get('domain');
  }

  get dependencies() {
    return this.form.get('dependencies');
  }

  get resources() {
    return this.form.get('resources');
  }

  get opportunities() {
    return this.form.get('opportunities');
  }

  get considerations() {
    return this.form.get('considerations');
  }

  get regulationExecutor() {
    return this.form.get('regulationExecutor');
  }

  get stakeholdersInternal() {
    return this.form.get('stakeholdersInternal');
  }

  get stakeholdersExternal() {
    return this.form.get('stakeholdersExternal');
  }
}
