import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng';
import { AppFileManagerService } from 'src/app/app-file-manager/app-file-manager.service';
import { EntityType } from 'src/app/policy/models/entity-type.enum';
import { Workflow } from 'src/app/workflow/models';
import { WorkflowStep } from 'src/app/workflow/models/workflow-step.enum';
import { WorkflowButtonEvent } from 'src/app/workflow/workflow-shared/workflow-button-group/models';
import { BaseComponent } from '../../../app-shared/base/base.component';
import { BasicValue, BasicValueInputContract, BasicValueType } from '../../../basicinfo/basic-value/basic-value.model';
import { BasicValueService } from '../../../basicinfo/basic-value/basic-value.service';
import { ContractSettingService } from '../../../basicinfo/contract-setting/service/contract-setting.service';
import { ActivityObject, ActivitySend, SendType } from '../../../cartable-new/models';
import { StartProcessInstanceBody } from '../../../cartable-new/models/start-process-instance-body';
import { ActivityService } from '../../../cartable-new/services/activity.service';
import { WorkflowVariableType } from '../../../cartable/models/workflow-variable-type.enum';
import { WorkflowButton } from '../../../workflow/workflow-shared/workflow-button-group/models/workflow-button';
import { WorkflowButtonGroupService } from '../../../workflow/workflow-shared/workflow-button-group/services/workflow-button-group.service';
import { RegulationCertificateService } from '../regulations-certificate/regulation-certificate.service';
import { RegulationsCertificate } from '../regulations-certificate/regulations-certificate.model';
import { RfpAttachFileComponent } from '../rfp/rfp-attach-file/rfp-attach-file.component';
import { Attachment, RFP } from '../rfp/rfp.model';
import { RfpService } from '../rfp/rfp.service';
import { Organizing } from './organizing.model';
import { ProposalOrganizing } from './proposal-organizing.model';
import { Proposal } from './proposal.model';
import { ProposalService } from './proposal.service';
import { WorksheetProposal } from './worksheet-proposal.model';
import { Worksheet } from './worksheet.model';

@Component({
  selector: 'app-proposal-create',
  templateUrl: './proposal-create.component.html',
  styleUrls: ['./proposal-create.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class ProposalCreateComponent extends BaseComponent implements OnInit, OnDestroy {

  certificate: RegulationsCertificate;
  applicationBasicLevelId: BasicValue[] = [];
  applicationBasicAreaId: BasicValue[] = [];
  basicValueInput: BasicValueInputContract;
  regulationTypeDesc: string;
  applicationLevelId: number;
  applicationAreaId: number;
  attachments: Attachment[] = [];
  proposalAttachments: Attachment[] = [];
  proposalOrganizing: ProposalOrganizing[] = [];
  worksheetProposal: WorksheetProposal[] = [];
  beforeSaveWorksheet: WorksheetProposal[] = [];
  pOrganizing: Organizing[] = [];
  wProposal: Worksheet[] = [];
  proposal: Proposal;
  rfp: RFP;
  file: any;
  editMode = false;
  worksheetPrice: number;
  sumAmount = 0;
  activityId: number;
  wfTaskId: string;
  workflowStep: string;
  senderUserId: number;
  checkout: any;
  educationImageFile: any;
  val3 = 'Option 111';
  actionTranslate: any;
  buttons: WorkflowButton[] = [];
  isCartable = false;
  certificateId: number;

  private _location: Location;

  constructor(
    private location: Location,
    private workflowButtonGroupService: WorkflowButtonGroupService,
    public appFileManager: AppFileManagerService,
    private basicValueService: BasicValueService,
    private fb: FormBuilder,
    private certificateService: RegulationCertificateService,
    private activatedRoute: ActivatedRoute,
    private rfpService: RfpService,
    public dialogService: DialogService,
    private activityService: ActivityService,
    private proposalService: ProposalService,
    private contractService: ContractSettingService
  ) {
    super();
    this.fillSubTables();
    this.contractService.loadData().subscribe(contract => {
      this.worksheetPrice = contract[0].worksheetPrice;
    });
    this._location = location;
  }

  ngOnInit(): void {
    this.createForm();
    this.radioButtonValue();

    this.activatedRoute.paramMap.subscribe(p => {
      this.certificateId = +p.get('id');
      this.activityId = +p.get('aid');
      this.wfTaskId = p.get('wfTaskId');
      this.workflowStep = p.get('workflowStep');
      this.senderUserId = +p.get('senderUserId');

      if (this.activityId) {
        this.isCartable = true;
      }

      if (this.certificateId) {
        this.loadData(this.certificateId);
      }
    });

  }

  fillSubTables() {
    this.proposalService.getOrganizing().subscribe(steps => {
      this.pOrganizing = steps;
      this.bindOrganizingData();
    });
    this.proposalService.getWorkSheet().subscribe(sheet => {
      this.wProposal = sheet;
      this.bindWorksheetData();
    });
  }

  loadData(certificateId: number) {
    this.certificateService.getCertificate(certificateId).subscribe(cert => {
      this.certificate = cert;
      this.applicationAreaId = cert.applicationAreaId;
      this.applicationLevelId = cert.applicationLevelId;
      this.rfpService.getRfpByCertificate(certificateId).subscribe(result => {
        this.rfp = result;
        result.attachments.forEach(value => {
          this.attachments.push(value);
        });
        this.loadProposal(certificateId);
      }, error => {
      });
      this.basicValueService.getBasicInfo(cert.regulationTypeId).subscribe(basicValue => {
        this.regulationTypeDesc = basicValue.title;
      });
    }, error => {
    });
  }

  loadProposal(certificateId: number) {
    this.proposalService.getProposal(certificateId).subscribe(proposal => {
      this.proposal = proposal;
      this.proposalOrganizing = proposal.proposalOrganizings;
      this.proposalAttachments = proposal.proposalAttachments;
      this.attachments = [];
      this.proposalAttachments?.forEach(propAttach => {
        this.attachments.push(propAttach);
      });
      this.rfp.attachments?.forEach(rfpAttach => {
        this.attachments.push(rfpAttach);
      });
      this.editMode = true;
      this.updateForm();
      this.createButton();
    }, error => {
      this.createButton();
    });
  }

  createForm() {
    this.form = this.fb.group({
      compilationNecessity: [null, Validators.compose([Validators.required])],
      compilationImportance: [null, Validators.compose([Validators.required])],
      regulationAbstract: [null, Validators.compose([Validators.required])],
      history: [null, Validators.compose([Validators.required])],
      generalFramework: [null, Validators.compose([Validators.required])]
    });
  }

  updateForm() {
    this.form.controls.compilationNecessity.setValue(this.proposal.compilationNecessity);
    this.form.controls.compilationImportance.setValue(this.proposal.compilationImportance);
    this.form.controls.regulationAbstract.setValue(this.proposal.regulationAbstract);
    this.form.controls.history.setValue(this.proposal.history);
    this.form.controls.generalFramework.setValue(this.proposal.generalFramework);
    this.proposalOrganizing.forEach(prop => {
      this.pOrganizing.forEach(original => {
        if (prop.organizingId === original.id) {
          prop.title = original.title;
          prop.description = original.description;
          prop.step = original.step;
        }
      });
    });
    this.updateWorksheet(this.proposal.worksheetProposals);
  }

  updateWorksheet(worksheet: WorksheetProposal[]) {
    this.worksheetProposal.forEach(ws => {
      ws.children.forEach(child => {
        worksheet.forEach(value => {
          if (value.worksheetId === child.worksheetId) {
            child.worksheetCount = value.worksheetCount;
            child.id = value.id;
            child.worksheetAmount = value.worksheetAmount;
          }
        });
      });
    });
    this.getSumAmount();
  }

  getBasicValueType(basicValueType: string) {
    return BasicValueType[basicValueType];
  }

  onSubmit() {
    if (this.validateSubTables()) {
      this.workflowButtonGroupService.loading();
      this.calculateAmount();
      this.getWorksheetData();
      this.getSumAmount();
      const prop = {
        compilationNecessity: this.compilationNecessity.value,
        compilationImportance: this.compilationImportance.value,
        regulationAbstract: this.regulationAbstract.value,
        history: this.history.value,
        generalFramework: this.generalFramework.value,
        proposalAttachments: !this.proposalAttachments ? [] : this.proposalAttachments,
        certificateId: this.certificate.id,
        proposalOrganizings: this.proposalOrganizing,
        worksheetProposals: this.beforeSaveWorksheet
      } as unknown as Proposal;
      prop.worksheetProposals.forEach(sheet => {
        sheet.worksheetAmount = sheet.worksheetCount * this.worksheetPrice;
      });
      if (this.editMode) {
        prop.id = this.proposal.id;
        this.proposalService.update(prop, this.proposalOrganizing, this.beforeSaveWorksheet).subscribe(proposal => {
          this.successNotify({ detail: 'تغییرات ذخیره گردید', summary: 'عملیات موفق' });
          this.workflowButtonGroupService.unLoading();
        }, error => {
          this.errorNotify({ detail: 'خطا هنگام ویرایش', summary: 'رخداد خطا' });
          this.workflowButtonGroupService.unLoading();
        });
      } else {
        this.proposalService.save(prop, this.proposalOrganizing, this.beforeSaveWorksheet).subscribe(proposal => {
          this.loadProposal(proposal.certificateId);
          this.successNotify({ detail: 'ثبت با موفقیت انجام شد.', summary: 'عملیات موفق' });
          this.workflowButtonGroupService.unLoading();
        }, error => {
          this.errorNotify({ detail: 'خطا هنگام ذخیره', summary: 'رخداد خطا' });
          this.workflowButtonGroupService.unLoading();
        });
      }
    }
  }

  send(activityText: string) {
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
    this.onSend(activityText, startProcessInstanceBody);
  }

  confirm() {
    const startProcessInstanceBody = {
      businessKey: this.certificate.id.toString(),
      variables: {
        approved: { value: true, type: WorkflowVariableType[WorkflowVariableType.Boolean] },
        formName: { value: 'Certificate', type: WorkflowVariableType[WorkflowVariableType.String] },
        unitId: { value: this.currentUser.orgUnit.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        userId: { value: this.currentUser.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        taskId: { value: this.wfTaskId, type: WorkflowVariableType[WorkflowVariableType.String] },
        ff_comfirmationStatus: { value: true, type: WorkflowVariableType[WorkflowVariableType.Boolean] }
      }
    } as StartProcessInstanceBody;
    this.onSend(null, startProcessInstanceBody);
  }

  unConfirm() {
    const startProcessInstanceBody = {
      businessKey: this.certificate.id.toString(),
      variables: {
        approved: { value: true, type: WorkflowVariableType[WorkflowVariableType.Boolean] },
        formName: { value: 'Certificate', type: WorkflowVariableType[WorkflowVariableType.String] },
        unitId: { value: this.currentUser.orgUnit.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        userId: { value: this.currentUser.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        taskId: { value: this.wfTaskId, type: WorkflowVariableType[WorkflowVariableType.String] },
        ff_comfirmationStatus: { value: false, type: WorkflowVariableType[WorkflowVariableType.Boolean] }
      }

    } as StartProcessInstanceBody;
    this.onSend(null, startProcessInstanceBody);
  }

  onSend(activityText: string, startProcessInstanceBody: StartProcessInstanceBody) {
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
    this.activityService.completeProcess(activity, startProcessInstanceBody, this.activityId).subscribe(res => {
      this.successNotify({ detail: 'ارسال با موفقیت انجام گردید', summary: 'عملیات موفق' });
      this.workflowButtonGroupService.unLoading();
    }, error => {
      console.error(error);
      this.errorNotify({ detail: 'خطا در هنگام ارسال', summary: 'رخداد خطا' });
      this.workflowButtonGroupService.unLoading();
    });
  }

  getWorksheetData() {
    this.beforeSaveWorksheet = [];
    this.worksheetProposal.forEach(worksheet => {
      worksheet.children.forEach(sheet => {
        this.beforeSaveWorksheet.push(sheet);
      });
    });
  }

  calculateAmount() {
    this.worksheetProposal.forEach(work => {
      work.worksheetAmount = work.worksheetCount * this.worksheetPrice;
      this.sumAmount += work.worksheetAmount;
    });
  }

  getSumAmount() {
    this.sumAmount = 0;
    this.worksheetProposal.forEach(work => {
      work.children.forEach(child => {
        this.sumAmount += child.worksheetAmount;
      });
    });
  }

  validateSubTables() {
    const organ = this.proposalOrganizing.filter(organize => organize.needTime === 0);
    if (organ.length > 0) {
      this.warningNotify({ detail: 'مدت زمان مورد نیاز می باید دارای مقدار باشد.', summary: 'ورود نادرست داده‌ها' });
      return false;
    } /*else {
      const sheep = this.beforeSaveWorksheet.filter(worksheet => worksheet.worksheetCount === 0);
      if (sheep.length > 0) {
        this.msgService.add({
          severity: 'warn',
          summary: 'ورود نادرست داده‌ها',
          detail: 'تعداد کاربرگ می باید دارای مقدار باشد.',
          key: 'tl'
        });
        return false;
      }
    }*/
    return true;
  }

  bindOrganizingData() {
    let proposalOrganizing;
    this.pOrganizing.forEach(org => {
      proposalOrganizing = new ProposalOrganizing(null, 0, null, org.id, org.step, org.title, org.description);
      this.proposalOrganizing.push(proposalOrganizing);
    });
  }

  bindWorksheetData() {
    let worksheetProposal;
    this.wProposal.forEach(sheet => {
      worksheetProposal = new WorksheetProposal(null, 0, null, null, sheet.id, sheet.title);
      worksheetProposal.children = [];
      sheet.children.forEach(value => {
        worksheetProposal.children.push(new WorksheetProposal(null, 0, null, null, value.id, value.title));
      });
      this.worksheetProposal.push(worksheetProposal);
    });
  }

  radioButtonValue() {
    this.basicValueService.getBasicInfo(BasicValueType.applicationLevel).subscribe(basicValue => {
      this.applicationBasicLevelId = basicValue.children;
    });

    this.basicValueInput = new BasicValueInputContract(String(BasicValueType.applicationArea), null);
    this.basicValueService.getBasicInfo(BasicValueType.applicationArea).subscribe(basicValue => {
      this.applicationBasicAreaId = basicValue.children;
    });
  }

  downloadAttachment(attach: any) {
    this.appFileManager.getFile(attach.id).subscribe(res => {
      this.appFileManager.openFile(res.data, res);
    });
  }

  DeleteAttach(attach: Attachment) {
    const rfpAttach = this.rfp.attachments.filter(value => value.id === attach.id);
    if (rfpAttach.length <= 0) {
      let index: number;
      let index1: number;
      index = this.attachments.indexOf(attach);
      index1 = this.proposalAttachments.indexOf(attach);
      if (index > -1) {
        this.attachments.splice(index, 1);
        this.proposalAttachments.splice(index, 1);
      }
    } else {
      this.errorNotify({ detail: 'فایل ضمیمه مربوط به کاربرگ انتظارات می باشد. امکان حذف ندارید.', summary: 'رخداد خطا' });
    }
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
        this.attachments.push(attach);
        this.proposalAttachments.push(attach);
      }
    });
  }

  ngOnDestroy(): void {
    this.form = null;
    this.rfp = null;
    this.proposalAttachments = null;
    this.attachments = null;
    this.proposalOrganizing = null;
    this.worksheetProposal = null;
    this.pOrganizing = null;
    this.wProposal = null;
    this.proposal = null;
    this.certificate = null;
  }

  onUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.educationImageFile = event.target.files[0];
    }
    event.srcElement.value = null;
  }

  createButton() {
    this.workflowButtonGroupService.clearButtons();
    if (this.workflowStep == WorkflowStep[WorkflowStep.Proposal]) {
      if (this.editMode) {
        this.workflowButtonGroupService.addEditButton((): void => {
          this.onSubmit();
        });
        this.workflowButtonGroupService.editButtonCheckFormInvalid(this.form);
      } else {
        this.workflowButtonGroupService.addCreateButton(({ srcElementEvent }: { srcElementEvent: any }): void => {
          this.onSubmit();
        });
        this.workflowButtonGroupService.createButtonCheckFormInvalid(this.form);
      }
    }

    this.workflowButtonGroupService.addBackButton((): void => {
      this.onBack();
    });
    if (this.isCartable) {
      if (this.editMode) {
        if (this.workflowStep == WorkflowStep[WorkflowStep.Proposal]) {
          this.workflowButtonGroupService.addSendButton({
            showCreateActivity: true,
            onClick: (event: WorkflowButtonEvent): void => { this.send(event.activity.text); }
          });
        }
      }
      if (this.workflowStep == WorkflowStep[WorkflowStep.CheckProposal]) {
        this.workflowButtonGroupService.addAcceptButton((): void => {
          this.confirm();
        });
        this.workflowButtonGroupService.addUnacceptButton((): void => {
          this.unConfirm();
        });
      }
    }

    this.workflowButtonGroupService.setWorkFlowInfo({ workflow: Workflow.Certificate, workflowStep: WorkflowStep.Proposal });
    this.workflowButtonGroupService.checkPolicy(EntityType.proposal);
    this.workflowButtonGroupService.setEditMode(this.editMode);
  }

  onBack() {
    this._location.back();
  }

  onRemoveUpload() {
    this.educationImageFile = null;
  }

  get compilationNecessity() {
    return this.form.get('compilationNecessity');
  }

  get compilationImportance() {
    return this.form.get('compilationImportance');
  }

  get regulationAbstract() {
    return this.form.get('regulationAbstract');
  }

  get history() {
    return this.form.get('history');
  }

  get generalFramework() {
    return this.form.get('generalFramework');
  }
}
