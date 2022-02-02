import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { utils } from 'src/app/app-shared/utils';
import { BasicValue, BasicValueType } from 'src/app/basicinfo/basic-value/basic-value.model';
import { BasicValueService } from 'src/app/basicinfo/basic-value/basic-value.service';
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
import { ExternalMemberModalComponent } from '../external-member-modal/external-member-modal.component';
import { TargetSpecification } from '../models/target-specification';
import { TargetSpecificationEdit } from '../models/target-specification-edit';
import { TargetSpecificationMember } from '../models/target-specification-member';
import { TargetSpecificationService } from '../services/target-specification.service';
import { TeamMemberModalComponent } from '../team-member-modal/team-member-modal.component';

@Component({
  selector: 'app-target-specification-edit',
  templateUrl: './target-specification-edit.component.html',
  styleUrls: ['./target-specification-edit.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class TargetSpecificationEditComponent extends BaseComponent implements OnInit {

  @ViewChild('teamMemberModal') teamMemberModal: TeamMemberModalComponent;
  @ViewChild('externalMemberModal') externalMemberModal: ExternalMemberModalComponent;

  id: number;
  certificate: RegulationsCertificate;

  targetSpecificationId: number;
  targetSpecification: TargetSpecification;

  editMode = false;
  actionTranslate: any;
  loading = false;
  private _location: Location;

  activityTypeItems: BasicValue[];

  members: TargetSpecificationMember[] = [];
  selectedMember: TargetSpecificationMember;
  cols: any;
  utils: any;

  currentUser: User | null = null;

  activityId: number;
  wfTaskId: any;
  activityType: any;

  cartableMode = false;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private targetSpecificationService: TargetSpecificationService,
    private basicValueService: BasicValueService,
    private regulationCertificateService: RegulationCertificateService,
    private workflowButtonGroupService: WorkflowButtonGroupService,
    private activityService: ActivityService) {
    super();

    this._location = location;
    this.utils = utils;

    this.translate.get('action').subscribe(res => {
      this.actionTranslate = res;
    });
  }

  ngOnInit(): void {
    this.setColumns();
    this.createForm();
    this.loadData();
    this.loadActivityTypes();
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

      this.workflowButtonGroupService.submitAndSendButtonCheckFormInvalid(this.form);
    }

    this.workflowButtonGroupService.setWorkFlowInfo({ workflow: Workflow.Certificate, workflowStep: WorkflowStep.TargetSpecification });

    this.workflowButtonGroupService.createButtonCheckFormInvalid(this.form);
    this.workflowButtonGroupService.editButtonCheckFormInvalid(this.form);

    this.workflowButtonGroupService.checkPolicy(EntityType.targetSpecification);
    this.workflowButtonGroupService.setEditMode(this.editMode);
  }

  setColumns() {
    this.translate.get('targetSpecificationMember').subscribe(res => {
      this.cols = [
        { field: 'memberName', header: res.memberName },
        { field: 'memberPost', header: res.memberPost }
      ];
    });
  }

  getMenuItems(member: TargetSpecificationMember): MenuItem[] {
    return [
      { label: this.actionTranslate.edit, icon: 'pi pi-pencil', command: () => { this.onEditMember(member); } },
      { label: this.actionTranslate.delete, icon: 'pi pi-times', command: () => { this.onDeleteMember(member); } }
    ] as MenuItem[];
  }

  getMemberName(member: TargetSpecificationMember) {
    if (member.teamMember) {
      return `${member.teamMember.expertPerson.firstName} ${member.teamMember.expertPerson.lastName}`;
    } else {
      return member.memberName;
    }
  }

  loadActivityTypes() {
    this.basicValueService.getBasicInfo(BasicValueType.activityTypes).subscribe(res => {
      this.activityTypeItems = res.children;
    }, error => {
      this.handleError(error);
    });
  }

  loadData() {
    this.activatedRoute.paramMap.subscribe(p => {

      this.id = +p.get('id');
      this.targetSpecificationId = +p.get('targetId');

      if (this.targetSpecificationId) {
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
        this.warningNotify({ detail: 'ابتدا باید شناسنامه آیین نامه را ثبت نمایید', summary: 'اخطار' });
        this.router.navigate(['../', 'certificate'], { relativeTo: this.activatedRoute });
        return;
      }

      this.certificateId.setValue(this.id);

      this.regulationCertificateService.getCertificate(this.id).subscribe(cert => {
        this.certificate = cert;
      }, error => {
        this.handleError(error);
      });

    });

    if (this.editMode) {
      this.loading = true;
      this.targetSpecificationService.getTargetSpecification(this.targetSpecificationId).subscribe(target => {
        this.loading = false;
        this.targetSpecification = target;

        this.updateForm();
      }, error => {
        this.loading = false;
        this.handleError(error);
      });
    }
  }

  get inValidExternalMember() { return false; }
  get inValidTeamMember() { return false; }

  get targetTitle() { return this.form.get('targetTitle'); }
  get activityTypes() { return this.form.get('activityTypes'); }
  get certificateId() { return this.form.get('certificateId'); }
  get targetSpecificationMembers() { return this.form.get('targetSpecificationMembers'); }

  createForm() {
    this.form = this.fb.group({
      targetTitle: [null, [Validators.required]],
      activityTypes: [null, [Validators.required]],
      certificateId: [null, [Validators.required]],
      targetSpecificationMembers: [null, [Validators.required]],
    });
  }

  updateForm() {
    this.targetTitle.setValue(this.targetSpecification.targetTitle);
    this.activityTypes.setValue(this.activityTypeItems.filter(x => this.targetSpecification.activityTypes.map(y => y.id).includes(x.id)));
    this.targetSpecificationMembers.setValue(this.targetSpecification.targetSpecificationMembers);
    this.members = [...this.targetSpecification.targetSpecificationMembers];
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.workflowButtonGroupService.loading();
    if (this.editMode) {
      this.targetSpecificationService.put(this.createTarget()).subscribe(rex => {
        this.workflowButtonGroupService.unLoading();
        this.onBack();
      }, error => {
        this.workflowButtonGroupService.unLoading();
        this.handleError(error);
      });
    } else {
      this.targetSpecificationService.post(this.createTarget()).subscribe(rex => {
        this.workflowButtonGroupService.unLoading();
        this.onBack();
      }, error => {
        this.workflowButtonGroupService.unLoading();
        this.handleError(error);
      });
    }
  }

  createTarget(): TargetSpecificationEdit {
    return {
      id: this.targetSpecification?.id,
      targetTitle: this.targetTitle.value,
      certificateId: this.certificateId.value,
      activityTypeIds: this.activityTypes.value.map(x => x.id),
      targetSpecificationMembers: this.targetSpecificationMembers.value
    };
  }

  onSubmitSend() {
    if (this.form.invalid) {
      return;
    }

    this.workflowButtonGroupService.loading();
    if (this.editMode) {
      this.targetSpecificationService.put(this.createTarget()).subscribe(rex => {
        this.workflowButtonGroupService.unLoading();
        this.send(null);
        this.onBack();
      }, error => {
        this.workflowButtonGroupService.unLoading();
        this.handleError(error);
      });
    } else {
      this.targetSpecificationService.post(this.createTarget()).subscribe(rex => {
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
      text: null, // activityInput.text,
      subject: this.certificate.title, // activityInput.subject,
      // classificationId: activityInput.classificationId,
      // priorityId: activityInput.priorityId,
      activityObject: obj,
      // receivers: [this.currentUser.id]
    };

    const startProcessInstanceBody = {
      businessKey: this.certificateId.value.toString(),
      variables: {
        approved: { value: true, type: WorkflowVariableType[WorkflowVariableType.Boolean] },
        formName: { value: 'Certificate', type: WorkflowVariableType[WorkflowVariableType.String] },
        unitId: { value: this.currentUser.orgUnit.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        userId: { value: this.currentUser.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        taskId: { value: this.wfTaskId, type: WorkflowVariableType[WorkflowVariableType.String] }
      }
    } as StartProcessInstanceBody;

    this.activityService.completeProcess(activity, startProcessInstanceBody, this.activityId).subscribe(res => {
      this.successNotify({ detail: 'ادامه فرآیند فرد خبره', summary: 'عملیات موفق' });
    }, error => {
      console.log(error);
      this.errorNotify({ detail: 'خطا در ادامه فرآیند فرد خبره', summary: 'رخداد خطا' });
    });
  }

  onAddTeamMember() {
    this.teamMemberModal.show(this.id);
  }

  addTeamMember(member: TargetSpecificationMember) {
    this.members.push(member);
    this.targetSpecificationMembers.setValue(this.members);
  }

  onAddExternalMember() {
    this.externalMemberModal.show();
  }

  addExternalMember(member: TargetSpecificationMember) {
    this.members.push(member);
    this.targetSpecificationMembers.setValue(this.members);
  }

  onDeleteMember(member: TargetSpecificationMember) {
    let index = this.members.indexOf(member);
    this.members.splice(index, 1);

    this.targetSpecificationMembers.setValue(this.members);
  }

  onEditMember(member: TargetSpecificationMember) {
    if (member.teamMember) {
      this.teamMemberModal.show(this.id, member);
    } else {
      this.externalMemberModal.show(member);
    }
  }

  onBack() {
    this._location.back();
  }

  handleError(error: any) {
    console.error(error);
    this.errorNotify({ detail: 'خطای نا مشخص', summary: 'رخداد خطا' });
  }

}
