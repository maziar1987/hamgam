import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppFileManagerService } from 'src/app/app-file-manager/app-file-manager.service';
import { ActivityObject, ActivitySend, SendType } from 'src/app/cartable-new/models';
import { StartProcessInstanceBody } from 'src/app/cartable-new/models/start-process-instance-body';
import { WorkflowVariableType } from 'src/app/cartable/models/workflow-variable-type.enum';
import { EntityType } from 'src/app/policy/models/entity-type.enum';
import { Workflow, WorkflowStep } from 'src/app/workflow/models';
import { PaymentService as PaymentServiceBasicinfo } from 'src/app/basicinfo/payment/payment.service';
import { WorkflowButtonEvent } from 'src/app/workflow/workflow-shared/workflow-button-group/models';
import { WorkflowButtonGroupService } from 'src/app/workflow/workflow-shared/workflow-button-group/services/workflow-button-group.service';
import { BaseComponent } from '../../../app-shared/base/base.component';
import { ActivityService } from '../../../cartable-new/services/activity.service';
import { SupervisionContractService } from './supervision-contract.service';
import { SupervisionContract } from './SupervisionContract.model';
import { CompilationContractService } from '../compilation-contract/compilation-contract.service';
@Component({
  selector: 'app-supervision-contract-create',
  templateUrl: './supervision-contract-create.component.html',
  styleUrls: ['./supervision-contract-create.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class SupervisionContractCreateComponent extends BaseComponent implements OnInit {

  supervisionContract: SupervisionContract;
  SupervisorFullName: string;
  certificateTitle: string;
  certificateId: number;
  attachmentFile: any;
  methodName: string;
  isCartable = false;
  activityId: number;
  activityType: any;
  editMode = false;
  form: FormGroup;
  wfTaskId: any;

  constructor(
    private workflowButtonGroupService: WorkflowButtonGroupService,
    private supervisionContractService: SupervisionContractService,
    private compilationContractService: CompilationContractService,
    private paymentServiceBasicinfo: PaymentServiceBasicinfo,
    public appFileManager: AppFileManagerService,
    private activityService: ActivityService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    this.activatedRoute.paramMap.subscribe(p => {

      this.activityId = +p.get('aid');
      this.wfTaskId = p.get('wfTaskId');
      this.activityType = p.get('activityType');
      if (this.activityId) {
        this.isCartable = true;
      }
    });
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.certificateId = params.id
        this.loadData(this.certificateId);
      } else {
        this.warningNotify({ summary: 'اخطار !', detail: 'ابتدا باید شناسنامه آیین نامه را ثبت نمایید' });
        this.router.navigate(['../', 'certificate'], { relativeTo: this.activatedRoute });
      }
    });
  }
  createButtons() {
    this.workflowButtonGroupService.addCreateButton(({ srcElementEvent }: { srcElementEvent: any }): void => { this.onSubmit(); });
    this.workflowButtonGroupService.addEditButton((): void => { this.onSubmit(); });
    this.workflowButtonGroupService.addBackButton((): void => { this.onBack(); });
    if (this.isCartable) {
      this.workflowButtonGroupService.addSendButton({
        showCreateActivity: true,
        onClick: (event: WorkflowButtonEvent): void => { this.send(event.activity.text); }
      });
    }

    // this.workflowButtonGroupService.setWorkFlowInfo({ workflow: Workflow.Certificate, workflowStep: WorkflowStep });

    this.workflowButtonGroupService.createButtonCheckFormInvalid(this.form);
    this.workflowButtonGroupService.editButtonCheckFormInvalid(this.form);

    this.workflowButtonGroupService.checkPolicy(EntityType.supervisionContract);
    this.workflowButtonGroupService.setEditMode(this.editMode);
  }
  loadData(certificateId: number) {
    this.compilationContractService.initiationForPayment(certificateId).subscribe(res => {
      this.paymentServiceBasicinfo.getById(res.paymentMethodId).subscribe(i => { this.methodName = i.methodName });
    });
    this.supervisionContractService.getInitiation(certificateId).subscribe(res => {
      this.certificateTitle = res.certificateTitle;
      this.SupervisorFullName = res.supervisorFullName;
      this.form.controls.contractAmountSupervisor.setValue(res.contractAmountSupervisor);
    });
    this.supervisionContractService.getSupervisionContractByCertificate(certificateId).subscribe(res => {
      this.supervisionContract = res;
      this.FillForm();
    }
      , error => {
        this.createButtons();
      });
  }
  createForm() {
    this.form = this.fb.group({
      contractDate: ['', [Validators.required]],
      contractDuration: ['', [Validators.required]],
      contractNo: ['', [Validators.required]],
      contractAmountSupervisor: [''],
      description: ['']
    });
  }
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const SupervisionContract = {
      certificateId: this.certificateId,
      id: this.supervisionContract?.id,
      attachmentId: this.supervisionContract?.attachmentId,
      contractDate: this.contractDate.value,
      contractDuration: this.contractDuration.value,
      contractNo: this.contractNo.value,
      contractAmountSupervisor: this.contractAmountSupervisor.value,
      description: this.description.value,
    } as SupervisionContract;
    this.workflowButtonGroupService.loading();
    if (this.editMode) {
      this.supervisionContractService.update(SupervisionContract, this.attachmentFile).subscribe(notify => {
        this.workflowButtonGroupService.unLoading();
        this.successNotify({ summary: 'عملیات موفق', detail: 'تغییرات ذخیره گردید' });
      }, error => {
        this.workflowButtonGroupService.unLoading();
        this.errorNotify({ summary: 'عملیات ناموفق', detail: 'خطا هنگام ویرایش' });
      });
    } else {
      this.supervisionContractService.save(SupervisionContract, this.attachmentFile).subscribe(res => {
        console.log('success');
        this.workflowButtonGroupService.unLoading();
        this.successNotify({ summary: 'عملیات موفق', detail: 'ثبت با موفقیت انجام شد' });
      }, error => {
        this.workflowButtonGroupService.unLoading();
        this.errorNotify({ summary: 'عملیات ناموفق', detail: 'خطا هنگام ثبت' });
      }, () => {
        console.log('complete');
      }
      );
    }
  }
  onBack() {
    this.location.back();
  }

  onUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.attachmentFile = event.target.files[0];
      if (this.editMode) { this.supervisionContract.attachmentId = null; }
    }
    event.srcElement.value = null;
  }

  onRemoveUpload() {
    this.attachmentFile = null;
    if (this.editMode) { this.supervisionContract.attachmentId = null; }
  }
  async FillForm() {
    this.editMode = true;
    this.createButtons();
    this.form.controls.contractDate.setValue(this.supervisionContract.contractDate);
    this.form.controls.contractDuration.setValue(this.supervisionContract.contractDuration);
    this.form.controls.contractNo.setValue(this.supervisionContract.contractNo);
    this.form.controls.description.setValue(this.supervisionContract.description);
    if (this.supervisionContract?.attachment?.id) {
      const attachmentFileData = `data:${this.supervisionContract.attachment.dataContentType};base64,` + this.supervisionContract.attachment.data;
      this.attachmentFile = await this.appFileManager.convertToFile(attachmentFileData, this.supervisionContract.attachment);
    }
  }
  get contractDate() {
    return this.form.get('contractDate');
  }
  get contractDuration() {
    return this.form.get('contractDuration');
  }
  get contractNo() {
    return this.form.get('contractNo');
  }
  get contractAmountSupervisor() {
    return this.form.get('contractAmountSupervisor');
  }
  get description() {
    return this.form.get('description');
  }
  send(activityText: string) {
    this.onSend(activityText);
  }

  onSend(activityText: string) {
    const obj: ActivityObject =
    {
      name: 'Certificate',
      objectType: 'Certificate',
      objectId: this.certificateId
    };
    const activity: ActivitySend =
    {
      sendType: SendType.FORWARD,
      text: activityText,
      subject: this.certificateTitle,
      activityObject: obj,
      // receivers: [this.currentUser.id]
    };

    const startProcessInstanceBody = {
      businessKey: this.certificateId.toString(),
      variables: {
        approved: { value: true, type: WorkflowVariableType[WorkflowVariableType.Boolean] },
        formName: { value: 'Certificate', type: WorkflowVariableType[WorkflowVariableType.String] },
        unitId: { value: this.currentUser.orgUnit.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        userId: { value: this.currentUser.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        taskId: { value: this.wfTaskId, type: WorkflowVariableType[WorkflowVariableType.String] }
      }
    } as StartProcessInstanceBody;
    this.workflowButtonGroupService.loading();
    this.activityService.completeProcess(activity, startProcessInstanceBody, this.activityId).subscribe(res => {
      this.workflowButtonGroupService.unLoading();
      console.log(res);
      this.successNotify({ summary: 'عملیات موفق', detail: 'شروع فرآیند آیین نامه' });
    }, error => {
      this.workflowButtonGroupService.unLoading();
      console.log(error);
      this.errorNotify({ summary: 'رخداد خطا', detail: 'خطا در شروع فرآیند آیین نامه' });
    });
  }
}
