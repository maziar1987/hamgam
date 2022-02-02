import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActivityObject, ActivitySend, SendType } from 'src/app/cartable-new/models';
import { AppFileManagerService } from 'src/app/app-file-manager/app-file-manager.service';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { PaymentMethod } from 'src/app/basicinfo/payment/model/payment-method';
import { PaymentService as PaymentServiceBasicinfo } from 'src/app/basicinfo/payment/payment.service';
import { ActivityService } from 'src/app/cartable-new/services/activity.service';
import { StartProcessInstanceBody } from 'src/app/cartable-new/models/start-process-instance-body';
import { WorkflowVariableType } from 'src/app/cartable/models/workflow-variable-type.enum';
import { EntityType } from 'src/app/policy/models/entity-type.enum';
import { WorkflowStep } from 'src/app/workflow/models/workflow-step.enum';
import { Workflow } from 'src/app/workflow/models/workflow.enum';
import { WorkflowButtonGroupService } from 'src/app/workflow/workflow-shared/workflow-button-group/services/workflow-button-group.service';
import { CompilationContractService } from '../compilation-contract/compilation-contract.service';
import { CompilationContractPayment, PaymentDTO, PaymentTable } from './paymant.model';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class PaymentComponent extends BaseComponent implements OnInit {
  @ViewChild('accept_modal') accept_modal: AcceptComponent;
  isCartable = false;
  activityId: number;
  activityType: any;
  editMode = false;
  loading: boolean = false;
  wfTaskId: any;
  certificateId: number;
  certificateTitle: string;
  methodName: string;
  paymentTables: PaymentTable[] = [];
  constructor(
    private compilationContractService: CompilationContractService,
    private activatedRoute: ActivatedRoute,
    private paymentServiceBasicinfo: PaymentServiceBasicinfo,
    private paymentService: PaymentService,
    private router: Router,
    private location: Location,
    public workflowButtonGroupService: WorkflowButtonGroupService,
    public appFileManager: AppFileManagerService,
    private activityService: ActivityService
  ) { super(); }

  ngOnInit(): void {
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
      this.createButtons();
      this.loadData(this.certificateId);
    }
  }
  createButtons() {

    // this.workflowButtonGroupService.addCreateButton(({ srcElementEvent }: { srcElementEvent: any }): void => {
    //   // this.Save();
    // });
    this.workflowButtonGroupService.addBackButton((): void => {
      this.onBack();
    });
    if (this.isCartable) {
      this.workflowButtonGroupService.addSubmitAndSendButton({
        showCreateActivity: true,
        onClick: (): void => {
          this.send();
        }
      });
    }

    this.workflowButtonGroupService.setWorkFlowInfo({ workflow: Workflow.Certificate, workflowStep: WorkflowStep.Workshop });

    // this.workflowButtonGroupService.createButtonCheckFormInvalid(this.form);
    this.workflowButtonGroupService.checkPolicy(EntityType.supervisionContract);

  }
  loadData(certificateId: number) {
    this.paymentTables = [];
    this.loading = true;
    this.compilationContractService.initiationForPayment(certificateId).subscribe(res => {
      this.paymentServiceBasicinfo.getById(res.paymentMethodId).subscribe(i => {
        this.paymentService.getPaymentByCertificate(certificateId).subscribe(x => { this.fillTable(res, i, x) });
      });
    });
  }
  onBack() {
    this.location.back();
  }
  fillTable(PaymentInit: CompilationContractPayment, paymentMethod: PaymentMethod, PaymentDTO: PaymentDTO[]) {
    this.certificateTitle = PaymentInit.certificateTitle;
    this.methodName = paymentMethod.methodName;
    paymentMethod.steps.forEach((element, index) => {
      for (let i = 0; i < 3; i++) {
        const temp = {
          stepNumber: index + 1,
          stepPercent: element,
          certificateId: this.certificateId,
          paymentMethodId: paymentMethod.id
        } as PaymentTable;

        switch (i) {
          case 0:
            temp.fullName = PaymentInit.executorFullName;
            temp.teamMemberId = PaymentInit.executorId;
            temp.responsibilityName = 'مجری';
            temp.amount = Math.floor(PaymentInit.contractAmountExecutor / element);
            break;
          case 1:
            temp.fullName = PaymentInit.masterSupervisorFullName;
            temp.teamMemberId = PaymentInit.masterSupervisorId;
            temp.responsibilityName = 'استاد راهنما';
            temp.amount = Math.floor(PaymentInit.contractAmountMaster / element);
            break;
          case 2:
            temp.fullName = PaymentInit.supervisorFullName;
            temp.teamMemberId = PaymentInit.supervisorId;
            temp.responsibilityName = 'ناظر';
            temp.amount = Math.floor(PaymentInit.contractAmountSupervisor / element);
            break;
          default:
            break;
        }
        let PaymentD = PaymentDTO.find(o => o.teamMemberId == temp.teamMemberId && o.paymentStep == index + 1);
        if (PaymentD) {
          temp.id = PaymentD.id;
          temp.description = PaymentD.description;
          temp.fileId = PaymentD.fileId;
          temp.paymentDate = PaymentD.paymentDate;
        }
        this.paymentTables.push(temp);
      }
      
    });
    this.loading = false;    
  }
  downloadAttach(rowNode: PaymentTable) {
    this.appFileManager.getFile(rowNode.fileId).subscribe(res => {
      this.appFileManager.convertToFile(`data:${res.dataContentType};base64,${res.data}`, res).then(
        f => this.appFileManager.openFile(f)
      );
    });
  }
  editPayment(payment: PaymentTable) {
    this.router.navigate(['regulations/add-edit/payment-edit/' + this.certificateId, {
      data: JSON.stringify(payment)
    }]);

  }

  deletePayment(rowNode: PaymentTable) {
    if (rowNode.id) {
      this.accept_modal.show('مورد انتخابی' + ' حذف شود؟', rowNode);
    } else {
      this.errorNotify({ detail: 'امکان حذف وجود ندارد', summary: 'رخداد خطا' });
    }
  }
  delete(event) {
    if (event.id) {
      this.paymentService.delete(event.id).subscribe(() => {
        this.successNotify({ detail: 'عملیات حذف با موفقیت انجام شد', summary: 'عملیات موفق' });
        this.loadData(this.certificateId);
      }, error => {
        this.errorNotify()
      });
    }
  }
  send() {
    this.onSend(null);
  }

  onSend(activityText: string) {
    this.workflowButtonGroupService.loading();
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
    this.activityService.completeProcess(activity, startProcessInstanceBody, this.activityId).subscribe(res => {
      this.successNotify({ detail: 'شروع فرآیند آیین نامه', summary: 'عملیات موفق' });
      this.workflowButtonGroupService.unLoading();
    }, error => {
      this.errorNotify({ detail: 'خطا در شروع فرآیند آیین نامه', summary: 'رخداد خطا' });
      this.workflowButtonGroupService.unLoading();
    });
  }

}
