import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityType } from 'src/app/policy/models/entity-type.enum';
import { Workflow, WorkflowStep } from 'src/app/workflow/models';
import { WorkflowButtonEvent } from 'src/app/workflow/workflow-shared/workflow-button-group/models';
import { BaseComponent } from '../../../../app-shared/base/base.component';
import { BasicValue, BasicValueType } from '../../../../basicinfo/basic-value/basic-value.model';
import { BasicValueService } from '../../../../basicinfo/basic-value/basic-value.service';
import { ActivityObject, ActivitySend, SendType } from '../../../../cartable-new/models';
import { StartProcessInstanceBody } from '../../../../cartable-new/models/start-process-instance-body';
import { ActivityService } from '../../../../cartable-new/services/activity.service';
import { WorkflowVariableType } from '../../../../cartable/models/workflow-variable-type.enum';
import { WorkflowButton } from '../../../../workflow/workflow-shared/workflow-button-group/models/workflow-button';
import { WorkflowButtonGroupService } from '../../../../workflow/workflow-shared/workflow-button-group/services/workflow-button-group.service';
import { NajaExpertsSessionService } from '../../naja-experts-session/services/naja-experts-session.service';
import { RegulationCertificateService } from '../../regulations-certificate/regulation-certificate.service';
import { RegulationsCertificate } from '../../regulations-certificate/regulations-certificate.model';
import { BaseTheory } from '../model/base-theory.model';
import { BaseTheoryService } from '../service/base-theory.service';

@Component({
  selector: 'app-add-edit-base-theory',
  templateUrl: './add-edit-base-theory.component.html',
  styleUrls: ['./add-edit-base-theory.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class AddEditBaseTheoryComponent extends BaseComponent implements OnInit {

  confirmationRfpValue: BasicValue[] = [];
  selectedConfirmationRfp: any;
  confirmationProposalValue: BasicValue[] = [];
  selectedConfirmationProposal: any;
  confirmationTeamValue: BasicValue[] = [];
  selectedConfirmationTeam: any;
  baseTheory: BaseTheory;
  certificate: RegulationsCertificate;
  certificateId: number;
  editMode = false;
  activityId: number;
  wfTaskId: any;
  activityType: any;
  baseId: number;
  public form: FormGroup;
  confirmationStatus: boolean;
  actionTranslate: any;
  buttons: WorkflowButton[] = [];
  isCartable = false;
  hasConditionalComfirmation: boolean;
  statusBasicValueItems: BasicValue[];

  // tslint:disable-next-line:variable-name
  private _location: Location;

  constructor(
    private location: Location,
    private workflowButtonGroupService: WorkflowButtonGroupService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private baseTheoryService: BaseTheoryService,
    private basicValueService: BasicValueService,
    private activityService: ActivityService,
    private regulationCertificateService: RegulationCertificateService,
    private najaExpertSessionService: NajaExpertsSessionService
  ) {
    super();
    this._location = location;
    this.basicValueService.getBasicInfo(BasicValueType.confirmationStatusTeam).subscribe(value => {
      this.statusBasicValueItems = value.children;
    });
  }

  ngOnInit(): void {
    this.createForm();
    this.radioButtonValue();
    this.activatedRoute.paramMap.subscribe(p => {
      this.certificateId = +p.get('id');
      this.activityId = +p.get('aid');
      this.wfTaskId = p.get('wfTaskId');
      this.activityType = p.get('activityType');
      this.baseId = +p.get('baseId');
      if (this.activityId) {
        this.isCartable = true;
      }
    });
    if (this.certificateId) {
      this.regulationCertificateService.getCertificate(this.certificateId).subscribe(cert => {
        this.certificate = cert;
      });
      this.loadData(this.baseId);
    }
  }

  loadData(baseId: number) {
    this.baseTheoryService.get(baseId).subscribe(res => {
      this.baseTheory = res;
      this.updateForm();
      this.editMode = true;
      this.createButton();
    }, error => {
      this.createButton();
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [null],
      confirmationDescriptionRfp: [''],
      confirmationDescriptionTeam: [''],
      confirmationDescriptionProposal: [''],
      confirmationStatusRfpID: [null, Validators.compose([Validators.required])],
      confirmationStatusTeamID: [null, Validators.compose([Validators.required])],
      confirmationStatusProposalID: [null, Validators.compose([Validators.required])]
    });
  }

  updateForm() {
    this.id.setValue(this.baseTheory.id);
    this.confirmationDescriptionRfp.setValue(this.baseTheory.confirmationDescriptionRfp);
    this.confirmationDescriptionTeam.setValue(this.baseTheory.confirmationDescriptionTeam);
    this.confirmationDescriptionProposal.setValue(this.baseTheory.confirmationDescriptionProposal);
    this.confirmationStatusRfpID.setValue(this.baseTheory.confirmationStatusRfpId);
    this.confirmationStatusTeamID.setValue(this.baseTheory.confirmationStatusTeamId);
    this.confirmationStatusProposalID.setValue(this.baseTheory.confirmationStatusProposalId);
  }

  radioButtonValue() {
    this.basicValueService.getBasicInfo(BasicValueType.confirmationStatusRfpBaseTheory).subscribe(basicValue => {
      this.confirmationRfpValue = basicValue.children;
      this.confirmationRfpValue.sort((a, b) => a.viewOrder > b.viewOrder ? 1 : -1);
      this.selectedConfirmationRfp = this.confirmationRfpValue[0].id;
    });
    this.basicValueService.getBasicInfo(BasicValueType.confirmationStatusTeamBaseTheory).subscribe(bi => {
      this.confirmationTeamValue = bi.children;
      this.confirmationTeamValue.sort((a, b) => a.viewOrder > b.viewOrder ? 1 : -1);
      this.selectedConfirmationTeam = this.confirmationTeamValue[0].id;
    });
    this.basicValueService.getBasicInfo(BasicValueType.confirmationStatusProposalBaseTheory).subscribe(bi => {
      this.confirmationProposalValue = bi.children;
      this.confirmationProposalValue.sort((a, b) => a.viewOrder > b.viewOrder ? 1 : -1);
      this.selectedConfirmationProposal = this.confirmationProposalValue[0].id;
    });
  }

  onSubmit() {
    this.workflowButtonGroupService.loading();
    const input = {
      id: this.baseTheory?.id,
      certificateId: this.certificate.id,
      confirmationStatusRfpId: this.confirmationStatusRfpID.value,
      confirmationStatusTeamId: this.confirmationStatusTeamID.value,
      confirmationStatusProposalId: this.confirmationStatusProposalID.value,
      confirmationDescriptionRfp: this.confirmationDescriptionRfp.value,
      confirmationDescriptionTeam: this.confirmationDescriptionTeam.value,
      confirmationDescriptionProposal: this.confirmationDescriptionProposal.value
    } as BaseTheory;
    if (this.editMode) {
      this.baseTheoryService.update(input).subscribe(res => {
        this.successNotify({ detail: 'ویرایش انجام شد', summary: 'عملیات موفق' });
        this.workflowButtonGroupService.unLoading();
      }, error => {
        this.errorNotify({ detail: 'عملیات ویرایش با موفقیت انجام نشد', summary: 'رخداد خطا' });
        this.workflowButtonGroupService.unLoading();
      });
    } else {
      this.baseTheoryService.save(input).subscribe(res => {
        this.loadData(res.id);
        this.successNotify({ detail: 'عملیات ثبت با موفقیت انجام شد', summary: 'عملیات موفق' });
        this.workflowButtonGroupService.unLoading();
      }, error => {
        this.errorNotify({ detail: 'عملیات ثبت با موفقیت انجام نشد', summary: 'رخداد خطا' });
        this.workflowButtonGroupService.unLoading();
      });
    }
  }

  send(activityText: string) {
    this.checkConfirmation();
    this.najaExpertSessionService.getLastSessionByCertificate(this.certificateId).subscribe(expertSession => {
      const biItem = this.statusBasicValueItems.find(x => x.code === '2');
      if (expertSession.confirmationStatusTeamID === biItem.id || expertSession.confirmationStatusProposalID === biItem.id ||
        expertSession.confirmationStatusRfpID === biItem.id) {
        this.hasConditionalComfirmation = true;
      } else {
        this.hasConditionalComfirmation = false;
      }
      this.onSend(activityText);
    }, error => {
      this.hasConditionalComfirmation = true;
      this.onSend(null);
    });
  }

  onSend(activityText: string) {
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
        ff_comfirmationStatus: { value: this.confirmationStatus, type: WorkflowVariableType[WorkflowVariableType.Boolean] },
        hasConditionalComfirmation: { value: this.hasConditionalComfirmation, type: WorkflowVariableType[WorkflowVariableType.Boolean] }
      }
    } as StartProcessInstanceBody;
    this.activityService.completeProcess(activity, startProcessInstanceBody, this.activityId).subscribe(res => {
      this.successNotify({ detail: 'ارسال با موفقیت انجام گردید', summary: 'عملیات موفق' });
    }, error => {
      this.errorNotify({ detail: 'خطا هنگام ارسال', summary: 'رخداد خطا' });
    });
  }

  checkConfirmation() {
    if (BasicValueType.confirmRFP === this.baseTheory.confirmationStatusRfpId &&
      BasicValueType.confirmTeam === this.baseTheory.confirmationStatusTeamId &&
      BasicValueType.confirmProposal === this.baseTheory.confirmationStatusProposalId) {
      this.confirmationStatus = true;
    } else {
      this.confirmationStatus = false;
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

    this.workflowButtonGroupService.setWorkFlowInfo({ workflow: Workflow.Certificate, workflowStep: WorkflowStep.BaseTheory });

    this.workflowButtonGroupService.createButtonCheckFormInvalid(this.form);
    this.workflowButtonGroupService.editButtonCheckFormInvalid(this.form);

    this.workflowButtonGroupService.checkPolicy(EntityType.baseTheory);
    this.workflowButtonGroupService.setEditMode(this.editMode);
  }

  onBack() {
    this._location.back();
  }

  get id() {
    return this.form.get('id');
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
}
