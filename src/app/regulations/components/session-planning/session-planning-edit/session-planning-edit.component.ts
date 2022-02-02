import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { ActivityObject, ActivitySend, SendType } from 'src/app/cartable-new/models';
import { StartProcessInstanceBody } from 'src/app/cartable-new/models/start-process-instance-body';
import { ActivityService } from 'src/app/cartable-new/services/activity.service';
import { WorkflowVariableType } from 'src/app/cartable/models/workflow-variable-type.enum';
import { EntityType } from 'src/app/policy/models/entity-type.enum';
import { User } from 'src/app/user-management/models/user';
import { Workflow, WorkflowStep } from 'src/app/workflow/models';
import { WorkflowButtonGroupService } from 'src/app/workflow/workflow-shared/workflow-button-group/services/workflow-button-group.service';
import { RegulationCertificateService } from '../../regulations-certificate/regulation-certificate.service';
import { RegulationsCertificate } from '../../regulations-certificate/regulations-certificate.model';
import { TargetSpecification } from '../../target-specification/models/target-specification';
import { TargetSpecificationService } from '../../target-specification/services/target-specification.service';
import { SessionMemberDuty, SessionPlanning, SessionPlanningEdit } from '../models';
import { SessionPlanningService } from '../services';

@Component({
  selector: 'app-session-planning-edit',
  templateUrl: './session-planning-edit.component.html',
  styleUrls: ['./session-planning-edit.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class SessionPlanningEditComponent extends BaseComponent implements OnInit {

  id: number;
  certificate: RegulationsCertificate;

  sessionPlanningId: number;
  sessionPlanning: SessionPlanning;

  editMode: boolean = false;
  actionTranslate: any;
  loading: boolean = false;
  private _location: Location;

  targets: TargetSpecification[];

  currentUser: User | null = null;

  activityId: number;
  wfTaskId: any;
  activityType: any;
  cartableMode: boolean = false;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sessionPlanningService: SessionPlanningService,
    private regulationCertificateService: RegulationCertificateService,
    private workflowButtonGroupService: WorkflowButtonGroupService,
    private targetService: TargetSpecificationService,
    private activityService: ActivityService
  ) {
    super();

    this._location = location;

    this.translate.get('action').subscribe(res => {
      this.actionTranslate = res;
    });
  }

  ngOnInit(): void {
    this.createForm();
    this.loadData();
  }

  createButtons() {
    this.workflowButtonGroupService.addCreateButton(({ srcElementEvent }: { srcElementEvent: any }): void => { this.onSubmit(); });
    this.workflowButtonGroupService.addEditButton((): void => { this.onSubmit(); });
    this.workflowButtonGroupService.addBackButton((): void => { this.onBack(); });

    if (this.cartableMode) {
      this.workflowButtonGroupService.addSubmitAndSendButton({
        showCreateActivity: true,
        onClick: (): void => { this.onSubmitSend(); }
      });
    }

    this.workflowButtonGroupService.setWorkFlowInfo({ workflow: Workflow.Certificate, workflowStep: WorkflowStep.SessionPlanning });

    this.workflowButtonGroupService.createButtonCheckFormInvalid(this.form);
    this.workflowButtonGroupService.editButtonCheckFormInvalid(this.form);
    this.workflowButtonGroupService.submitAndSendButtonCheckFormInvalid(this.form);

    this.workflowButtonGroupService.checkPolicy(EntityType.sessionPlanning);
    this.workflowButtonGroupService.setEditMode(this.editMode);
  }

  loadData() {
    this.activatedRoute.paramMap.subscribe(p => {

      this.id = +p.get('id');
      this.sessionPlanningId = +p.get('sessionId');

      if (this.sessionPlanningId) {
        this.editMode = true;
      }

      this.activityId = +p.get('aid');
      this.wfTaskId = p.get('wfTaskId');
      this.activityType = p.get('activityType');

      if (this.activityId) {
        this.cartableMode = true;
      }

      this.createButtons();

      if (!this.id) {
        this.warningNotify({ detail: 'ابتدا باید شناسنامه آیین نامه را ثبت نمایید', summary: 'اخطار ' });
        this.router.navigate(['../', 'certificate'], { relativeTo: this.activatedRoute });
        return;
      }

      this.certificateId.setValue(this.id);

      this.regulationCertificateService.getCertificate(this.id).subscribe(cert => {
        this.certificate = cert;
      }, error => {
        this.handleError(error);
      });

      this.targetService.getTargetSpecificationsList(this.certificateId.value).subscribe(res => {
        this.targets = res;
        if (!this.editMode && this.targets?.length > 0) {
          this.targetSpecification.setValue(this.targets[0]);
          this.onChangeTarget(this.targetSpecification.value);
        }
      }, error => {
        this.handleError(error);
      });

    });

    if (this.editMode) {
      this.loading = true;
      this.sessionPlanningService.getSessionPlanning(this.sessionPlanningId).subscribe(session => {
        this.loading = false;
        this.sessionPlanning = session;

        this.updateForm();
      }, error => {
        this.loading = false;
        this.handleError(error);
      });
    }
  }

  get certificateId() { return this.form.get('certificateId') }
  get sessionDate() { return this.form.get('sessionDate') }
  get sessionTime() { return this.form.get('sessionTime') }
  get targetSpecification() { return this.form.get('targetSpecification') }
  get sessionMemberDuties() { return this.form.get('sessionMemberDuties') }

  createForm() {
    this.form = this.fb.group({
      certificateId: [null, [Validators.required]],
      sessionDate: [null, [Validators.required]],
      sessionTime: [null, [Validators.required]],
      targetSpecification: [null, [Validators.required]],
      sessionMemberDuties: [null, [Validators.required]]
    });
  }

  updateForm() {
    this.sessionDate.setValue(this.sessionPlanning.sessionDate)
    this.sessionTime.setValue(this.sessionPlanning.sessionTime);
    this.targetSpecification.setValue(this.sessionPlanning.targetSpecification);
    this.sessionMemberDuties.setValue(this.sessionPlanning.sessionMemberDuties);
  }

  onChangeTarget(target: TargetSpecification) {
    var duties: SessionMemberDuty[] = target.targetSpecificationMembers.map(x => <SessionMemberDuty>{
      targetSpecificationMember: x,
      targetSpecificationMemberId: x.id,
      sessionPlanningId: this.sessionPlanningId,
      duty: null
    });

    this.sessionMemberDuties.setValue(duties);
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.workflowButtonGroupService.loading();
    if (this.editMode) {
      this.sessionPlanningService.put(this.createSession()).subscribe(rex => {
        this.workflowButtonGroupService.unLoading();
        this.onBack();
      }, error => {
        this.workflowButtonGroupService.unLoading();
        this.handleError(error);
      });
    } else {
      this.sessionPlanningService.post(this.createSession()).subscribe(rex => {
        this.workflowButtonGroupService.unLoading();
        this.onBack();
      }, error => {
        this.workflowButtonGroupService.unLoading();
        this.handleError(error);
      });
    }
  }

  createSession(): SessionPlanningEdit {
    return {
      id: this.sessionPlanning?.id,
      certificateId: this.certificateId.value,
      sessionDate: this.sessionDate.value,
      sessionTime: this.sessionTime.value,
      targetSpecificationId: this.targetSpecification.value.id,
      sessionMemberDuties: this.sessionMemberDuties.value
    };
  }

  onSubmitSend() {
    if (this.form.invalid) {
      return;
    }

    this.workflowButtonGroupService.loading();
    if (this.editMode) {
      this.sessionPlanningService.put(this.createSession()).subscribe(rex => {
        this.workflowButtonGroupService.unLoading();
        this.send(null);
        this.onBack();
      }, error => {
        this.workflowButtonGroupService.unLoading();
        this.handleError(error);
      });
    } else {
      this.sessionPlanningService.post(this.createSession()).subscribe(rex => {
        this.workflowButtonGroupService.unLoading();
        this.send(null);
        this.onBack();
      }, error => {
        this.workflowButtonGroupService.unLoading();
        this.handleError(error);
      });
    }
  }

  send(activityInput: ActivitySend) {
    const obj: ActivityObject =
    {
      name: 'Certificate',
      objectType: 'Certificate',
      objectId: this.certificate.id
    };

    const activity: ActivitySend =
    {
      sendType: SendType.FORWARD,
      text: null,// activityInput.text,
      subject: this.certificate.title,//activityInput.subject,
      // classificationId: activityInput.classificationId,
      // priorityId: activityInput.priorityId,
      activityObject: obj,
      // receivers: [this.currentUser.id]
    };

    var startProcessInstanceBody: StartProcessInstanceBody = {
      businessKey: this.certificateId.value.toString(),
      variables: {
        approved: { value: true, type: WorkflowVariableType[WorkflowVariableType.Boolean] },
        formName: { value: "Certificate", type: WorkflowVariableType[WorkflowVariableType.String] },
        unitId: { value: this.currentUser.orgUnit.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        userId: { value: this.currentUser.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        taskId: { value: this.wfTaskId, type: WorkflowVariableType[WorkflowVariableType.String] }
      }
    };

    this.activityService.completeProcess(activity, startProcessInstanceBody, this.activityId).subscribe(res => {
      this.successNotify({ detail: 'ادامه فرآیند فرد خبره', summary: 'عملیات موفق' });
    }, error => {
      console.log(error);
      this.errorNotify({ detail: 'خطا در ادامه فرآیند فرد خبره', summary: 'رخداد خطا' });
    });
  }

  onBack() {
    this._location.back();
  }

  handleError(error: any) {
    console.error(error);
    this.errorNotify({ detail: 'خطای نا مشخص', summary: 'رخداد خطا' });
  }

}
