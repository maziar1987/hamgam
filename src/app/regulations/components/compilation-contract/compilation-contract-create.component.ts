import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng';
import { AppFileManagerService } from 'src/app/app-file-manager/app-file-manager.service';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { PaymentService } from 'src/app/basicinfo/payment/payment.service';
import { ActivityObject, ActivitySend, SendType } from 'src/app/cartable-new/models';
import { StartProcessInstanceBody } from 'src/app/cartable-new/models/start-process-instance-body';
import { WorkflowVariableType } from 'src/app/cartable/models/workflow-variable-type.enum';
import { EntityType } from 'src/app/policy/models/entity-type.enum';
import { Workflow, WorkflowStep } from 'src/app/workflow/models';
import { WorkflowButtonGroupService } from 'src/app/workflow/workflow-shared/workflow-button-group/services/workflow-button-group.service';
import { ActivityService } from '../../../cartable-new/services/activity.service';
import { CompilationContract } from '../compilation-contract/CompilationContract.model';
import { CompilationContractService } from './compilation-contract.service';

@Component({
  selector: 'app-compilation-contract-create',
  templateUrl: './compilation-contract-create.component.html',
  styleUrls: ['./compilation-contract-create.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class CompilationContractCreateComponent extends BaseComponent implements OnInit {

  compilationContract: CompilationContract;
  SupervisorFullName: string;
  certificateTitle: string;
  certificateId: number;
  bossFullName: string;
  attachmentFile: any;
  isCartable = false;
  activityId: number;
  activityType: any;
  editMode = false;
  hasPayment = false;
  wfTaskId: any;
  paymentItems: SelectItem[];

  constructor(
    private compilationContractService: CompilationContractService,
    private workflowButtonGroupService: WorkflowButtonGroupService,
    public appFileManager: AppFileManagerService,
    private activityService: ActivityService,
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private location: Location,
    private fb: FormBuilder,
    private router: Router,
  ) { super(); }

  ngOnInit(): void {
    this.createForm();
    this.paymentService.getDropdown().subscribe(res => {
      this.paymentItems = res.map(x => <SelectItem>{ label: `${x.methodName} `, value: x });
    });
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
        this.certificateId = params.id;
      } else {
        this.warningNotify({ summary: 'اخطار !', detail: 'ابتدا باید شناسنامه آیین نامه را ثبت نمایید' });
        this.router.navigate(['../', 'certificate'], { relativeTo: this.activatedRoute });
      }
    });
    if (this.certificateId) {
      this.loadData(this.certificateId);
    }
  }

  loadData(certificateId: number) {
    this.compilationContractService.getCompilationContractsAmounts(certificateId).subscribe(res => {
      this.certificateTitle = res.certificateTitle;
      this.bossFullName = res.executorFullName;
      this.SupervisorFullName = res.masterSupervisorFullName;
      this.contractAmountExecutor.setValue(res.contractAmountExecutor);
      this.contractAmountMaster.setValue(res.contractAmountMaster);
    });
    this.compilationContractService.getCompilationContractByCertificate(certificateId).subscribe(res => {
      this.compilationContract = res;
      this.FillForm();
    }
      , error => {
        this.createButtons();
      });
  }
  createButtons() {
    this.workflowButtonGroupService.addCreateButton(({ srcElementEvent }: { srcElementEvent: any }): void => { this.onSubmit(); });
    this.workflowButtonGroupService.addEditButton((): void => { this.onSubmit(); });
    this.workflowButtonGroupService.addBackButton((): void => { this.onBack(); });

    if (this.isCartable)
      this.workflowButtonGroupService.addSubmitAndSendButton({
        showCreateActivity: true,
        onClick: (): void => { this.send(); }
      });

    this.workflowButtonGroupService.setWorkFlowInfo({ workflow: Workflow.Certificate, workflowStep: WorkflowStep.CompilationContract });

    this.workflowButtonGroupService.createButtonCheckFormInvalid(this.form);
    this.workflowButtonGroupService.editButtonCheckFormInvalid(this.form);

    this.workflowButtonGroupService.checkPolicy(EntityType.compilationContract);
    this.workflowButtonGroupService.setEditMode(this.editMode);
  }
  onUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.attachmentFile = event.target.files[0];
      if (this.editMode) { this.compilationContract.attachmentId = null; }
    }
    event.srcElement.value = null;
  }

  onRemoveUpload() {
    this.attachmentFile = null;
    if (this.editMode) { this.compilationContract.attachmentId = null; }
  }
  createForm() {
    this.form = this.fb.group({
      contractDuration: ['', [Validators.required]],
      contractDate: ['', [Validators.required]],
      contractNo: ['', [Validators.required]],
      payment: ['', [Validators.required]],
      contractAmountExecutor: [''],
      contractAmountMaster: [''],
      description: ['']
    });
  }
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const CompilationContract = {
      certificateId: this.certificateId,
      id: this.compilationContract?.id,
      attachmentId: this.compilationContract?.attachmentId,
      contractDate: this.contractDate.value,
      contractDuration: this.contractDuration.value,
      contractNo: this.contractNo.value,
      contractAmountExecutor: this.contractAmountExecutor.value,
      contractAmountMaster: this.contractAmountMaster.value,
      description: this.description.value,
      paymentMethodId: this.payment.value.id
    } as CompilationContract;
    this.workflowButtonGroupService.loading();
    if (this.editMode) {
      this.compilationContractService.update(CompilationContract, this.attachmentFile).subscribe(notify => {
        this.workflowButtonGroupService.unLoading();
        this.successNotify({ detail: 'تغییرات ذخیره گردید', summary: 'عملیات موفق' });
      }, error => {
        this.workflowButtonGroupService.unLoading();
        this.errorNotify({ detail: 'خطا هنگام ویرایش', summary: 'رخداد خطا' });
      });
    } else {
      this.compilationContractService.save(CompilationContract, this.attachmentFile).subscribe(res => {
        this.workflowButtonGroupService.unLoading();
        this.successNotify({ summary: 'عملیات موفق', detail: 'ثبت با موفقیت انجام شد' });
      }, error => {
        this.workflowButtonGroupService.unLoading();
        this.errorNotify({ summary: 'رخداد خطا', detail: 'خطا هنگام ثبت' });
      });
    }

  }
  async FillForm() {
    this.editMode = true;
    this.hasPayment = this.compilationContract.hasPayment;
    this.createButtons();
    this.contractDate.setValue(this.compilationContract.contractDate);
    this.contractDuration.setValue(this.compilationContract.contractDuration);
    this.contractNo.setValue(this.compilationContract.contractNo);
    this.description.setValue(this.compilationContract.description);
    this.payment.setValue(this.paymentItems.find(x => x.value.id == this.compilationContract.paymentMethodId)?.value);
    if (this.compilationContract?.attachment?.id) {
      const attachmentFileData = `data:${this.compilationContract.attachment.dataContentType};base64,` + this.compilationContract.attachment.data;
      this.attachmentFile = await this.appFileManager.convertToFile(attachmentFileData, this.compilationContract.attachment);
    }
  }
  onBack() {
    this.location.back();
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
  get contractAmountExecutor() {
    return this.form.get('contractAmountExecutor');
  }
  get contractAmountMaster() {
    return this.form.get('contractAmountMaster');
  }
  get description() {
    return this.form.get('description');
  }
  get payment() {
    return this.form.get('payment');
  }
  send() {
    this.onSend(null);
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
    this.workflowButtonGroupService.loading()
    this.activityService.completeProcess(activity, startProcessInstanceBody, this.activityId).subscribe(res => {
      this.workflowButtonGroupService.unLoading();
      this.successNotify({ summary: 'عملیات موفق', detail: 'شروع فرآیند آیین نامه' });
    }, error => {
      this.workflowButtonGroupService.unLoading();
      console.error(error);
      this.errorNotify({ summary: 'رخداد خطا', detail: 'خطا در شروع فرآیند آیین نامه' });
    });
  }
}
