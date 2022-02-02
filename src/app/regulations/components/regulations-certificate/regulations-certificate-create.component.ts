import { Location } from '@angular/common';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeNode } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppFileManagerService } from 'src/app/app-file-manager/app-file-manager.service';
import { Orgunit } from 'src/app/basicinfo/orgunit/orgunit.model';
import { ActivityObject, ActivitySend } from 'src/app/cartable-new/models';
import { ActivityService } from 'src/app/cartable-new/services/activity.service';
import { EntityType } from 'src/app/policy/models/entity-type.enum';
import { Workflow, WorkflowStep } from 'src/app/workflow/models';
import { WorkflowButton } from 'src/app/workflow/workflow-shared/workflow-button-group/models';
import { BaseComponent } from '../../../app-shared/base/base.component';
import { BasicValue, BasicValueType } from '../../../basicinfo/basic-value/basic-value.model';
import { BasicValueService } from '../../../basicinfo/basic-value/basic-value.service';
import { StartProcessInstanceBody } from '../../../cartable-new/models/start-process-instance-body';
import { SendType } from '../../../cartable/models/activity.model';
import { WorkflowVariableType } from '../../../cartable/models/workflow-variable-type.enum';
import { WorkflowButtonGroupService } from '../../../workflow/workflow-shared/workflow-button-group/services/workflow-button-group.service';
import { CertificateStatusComponent } from './certificate-status/certificate-status.component';
import { CertificateStatus } from './certificate-status/certificate-status.model';
import { RegulationCertificateService } from './regulation-certificate.service';
import { RegulationsCertificate } from './regulations-certificate.model';


@Component({
  selector: 'app-regulations-certificate',
  templateUrl: './regulations-certificate-create.component.html',
  styleUrls: ['./regulations-certificate-create.component.scss'],
  providers: [WorkflowButtonGroupService]
})
export class RegulationsCertificateCreateComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges {

  selectedBasicValueType: BasicValue;
  placement = 'bottom';
  compilationStatusValue: BasicValue[] = [];
  applicationBasicLevelId: BasicValue[] = [];
  applicationBasicAreaId: BasicValue[] = [];
  certificate: RegulationsCertificate;
  editMode = false;
  certificateStatus: CertificateStatus;
  statusAttachment: File;
  ref: DynamicDialogRef;
  selectedProducer: Orgunit;
  selectedNode: TreeNode;
  displayOrgUnitTree = false;
  lastStatus = '';
  visibleStar = true;
  selectedArea: any;
  selectedCompilation: any;
  selectedLevel: any;
  actionTranslate: any;
  buttons: WorkflowButton[] = [];
  isCartable = false;
  certificateId: number;

  // tslint:disable-next-line:variable-name
  private _location: Location;

  constructor(
    private location: Location,
    private workflowButtonGroupService: WorkflowButtonGroupService,
    public appFileManager: AppFileManagerService,
    private basicValueService: BasicValueService,
    private fb: FormBuilder,
    private service: RegulationCertificateService,
    public dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router,
    private activityService: ActivityService) {
    super();
    this._location = location;
  }

  ngOnInit(): void {
    this.createForm();
    this.radioButtonValue();
    this.route.params.subscribe(params => {
      if (Object.keys(params).length !== 0 && params.id) {
        this.certificateId = params.id;
        if (params.wfTaskId) {
          this.isCartable = true;
        }
      }
    });
    if (this.certificateId) {
      this.loadData(this.certificateId);
    } else {
      this.createButton();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  loadData(certificateId: number) {
    this.service.getCertificate(certificateId).subscribe(result => {
      this.certificate = result;
      this.editMode = true;
      this.createButton();
      this.updateForm();
      this.getLastStatus();
    }, error => {
      this.editMode = false;
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [''],
      unitId: [null],
      title: [null, Validators.compose([Validators.required])],
      regulationTypeId: [null, Validators.compose([Validators.required])],
      registerNo: [null, Validators.compose([Validators.required])],
      code: [null, Validators.compose([Validators.required])],
      confidentialityId: [null],
      compilationStatusId: [null],
      producerId: [null],
      confirmerId: [null],
      applicationLevelId: [null],
      applicationAreaId: [null],
      certificateStatus: [null, Validators.compose([Validators.required])]
    });
  }

  updateForm() {
    this.form.get('certificateStatus').disable();
    this.form.controls.id.setValue(this.certificate.id);
    this.form.controls.title.setValue(this.certificate.title);
    this.form.controls.regulationTypeId.setValue(this.certificate.regulationTypeId);
    this.form.controls.registerNo.setValue(this.certificate.registerNo);
    this.form.controls.code.setValue(this.certificate.code);
    this.form.controls.confidentialityId.setValue(this.certificate.confidentialityId);
    this.form.controls.compilationStatusId.setValue(this.certificate.compilationStatusId);
    this.form.controls.confirmerId.setValue(this.certificate.confirmerId);
    this.form.controls.applicationLevelId.setValue(this.certificate.applicationLevelId);
    this.form.controls.applicationAreaId.setValue(this.certificate.applicationAreaId);
    this.orgUnitService.getOrgUnit(this.certificate.producerId).subscribe(res => {
      this.selectedProducer = res;
    });
  }

  getBasicValueType(basicValueType: string) {
    return BasicValueType[basicValueType];
  }

  onSubmit() {
    this.workflowButtonGroupService.loading();
    const certificate = {
      unitId: this.currentUser.orgUnit?.id,
      title: this.title.value,
      regulationTypeId: this.regulationTypeId.value,
      registerNo: this.registerNo.value,
      code: this.code.value,
      confidentialityId: this.confidentialityId?.value,
      compilationStatusId: this.compilationStatusId?.value,
      producerId: this.producerId.value === null ? this.selectedProducer?.id : this.producerId.value,
      confirmerId: this.confirmerId?.value,
      applicationLevelId: this.applicationLevelId?.value,
      applicationAreaId: this.applicationAreaId?.value
    } as RegulationsCertificate;
    if (this.editMode) {
      certificate.id = this.certificate.id;
      // this.onSend(certificate, null);
      this.service.update(certificate).subscribe(data => {
        this.translate.get('message.update').subscribe(res => {
          this.successNotify({ detail: res.successful.successMessage, summary: res.successful.successful });
        });
        this.workflowButtonGroupService.unLoading();
      }, error => {
        this.translate.get('message.failed').subscribe(trans => {
          this.translate.get('message.save').subscribe(res => {
            this.errorNotify({ detail: res.unsuccessful.errorMessage, summary: res.unsuccessful.unsuccessful });
          });
        });
        this.workflowButtonGroupService.unLoading();
      });
    } else {
      this.service.save(certificate, this.certificateStatus, this.statusAttachment).subscribe(res => {
        this.loadData(res.id);
        this.translate.get('message.success').subscribe(trans => {
          this.translate.get('message.save').subscribe(res => {
            this.successNotify({ detail: res.successful.successMessage, summary: res.successful.successful });
          });
        });
        this.workflowButtonGroupService.unLoading();
      }, error => {
        this.translate.get('message.failed').subscribe(trans => {
          this.translate.get('message.save').subscribe(res => {
            this.errorNotify({ detail: res.unsuccessful.errorMessage, summary: res.unsuccessful.unsuccessful });
          });
        });
        this.workflowButtonGroupService.unLoading();
      });
    }
  }

  onAddStatus() {
    this.ref = this.dialogService.open(CertificateStatusComponent, {
      data: { id: this.certificate?.id },
      width: '70%',
      contentStyle: { 'max-height': '650px', overflow: 'auto', direction: 'rtl', 'text-align': 'right' }
    });
    this.ref.onClose.subscribe((formGruop: FormGroup) => {
      this.certificateStatus = formGruop.value;
      this.certificateStatus.attachment = formGruop.controls.attachment.value;
      this.statusAttachment = formGruop.controls.attachment.value;
      this.form.controls.certificateStatus.setValue(formGruop);
      if (this.certificateStatus.statusId === BasicValueType.statusRequired) {
        this.form.get('code').clearValidators();
        this.form.get('registerNo').clearValidators();
      } else {
        this.form.get('code').setValidators([Validators.required]);
        this.form.get('registerNo').setValidators([Validators.required]);
      }
      this.form.get('code').updateValueAndValidity();
      this.form.get('registerNo').updateValueAndValidity();
      this.basicValueService.getBasicInfo(this.certificateStatus.statusId).subscribe(value => {
        this.lastStatus = value.title;
      });
    });
  }

  showOrgUnitTreeDialog() {
    this.displayOrgUnitTree = true;
  }

  nodeSelect(event: TreeNode) {
    this.selectedNode = event;
  }

  selectOrgUnit() {
    this.selectedProducer = this.selectedNode.data;
    this.form.controls.producerId.setValue(this.selectedProducer.id);
    this.displayOrgUnitTree = false;
  }

  closeOrgUnitTreeDialog() {
    this.selectedProducer = null;
    this.producerId.reset();
    this.displayOrgUnitTree = false;
  }

  onAttachmentFile(event): void {
    this.statusAttachment = event;
  }

  selectBasicValueType(event: BasicValue) {
    this.selectedBasicValueType = event;
  }

  radioButtonValue() {
    this.basicValueService.getBasicInfo(BasicValueType.compilationStatusId).subscribe(basicValue => {
      this.compilationStatusValue = basicValue.children;
      this.selectedCompilation = this.compilationStatusValue[0].id;
    });

    this.basicValueService.getBasicInfo(BasicValueType.applicationLevel).subscribe(basicValue => {
      this.applicationBasicLevelId = basicValue.children;
      this.selectedLevel = this.applicationBasicLevelId[0].id;
    });

    this.basicValueService.getBasicInfo(BasicValueType.applicationArea).subscribe(basicValue => {
      this.applicationBasicAreaId = basicValue.children;
      this.selectedArea = this.applicationBasicAreaId[0].id;
    });
  }

  onStatusList() {
    this.router.navigateByUrl('regulations/add-edit/status-list/' + this.certificate.id);
  }

  send() {
    this.onSend(this.certificate, null);
  }

  onSend(certificate: RegulationsCertificate, activityText: string) {
    this.workflowButtonGroupService.loading();
    const obj: ActivityObject =
    {
      name: 'Certificate',
      objectType: 'Certificate',
      objectId: certificate.id
    };
    const activity: ActivitySend =
    {
      sendType: SendType.COMPOSE,
      text: activityText,
      subject: certificate.title,
      activityObject: obj,
      // receivers: [this.currentUser.id]
    };

    const startProcessInstanceBody = {
      businessKey: certificate.id.toString(),
      variables: {
        approved: { value: true, type: WorkflowVariableType[WorkflowVariableType.Boolean] },
        formName: { value: 'Certificate.Create', type: WorkflowVariableType[WorkflowVariableType.String] },
        unitId: { value: this.currentUser.orgUnit.id, type: WorkflowVariableType[WorkflowVariableType.Integer] },
        userId: { value: this.currentUser.id, type: WorkflowVariableType[WorkflowVariableType.Integer] }
      }
    } as StartProcessInstanceBody;
    this.activityService.startProcess(activity, startProcessInstanceBody, 'bp_regulationManagement').subscribe(res => {
      this.successNotify({ detail: 'شروع فرآیند آیین نامه', summary: 'عملیات موفق' });
      this.workflowButtonGroupService.unLoading();
    }, error => {
      this.errorNotify({ detail: 'خطا در شروع فرآیند آیین نامه', summary: 'رخداد خطا' });
      this.workflowButtonGroupService.unLoading();
    });
  }

  onBack() {
    this._location.back();
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
    if (this.editMode) {
      this.workflowButtonGroupService.addSubmitAndSendButton({
        showCreateActivity: true,
        onClick: (): void => { this.send(); }
      });
    }

    // this.workflowButtonGroupService.setWorkFlowInfo({ workflow: Workflow.Certificate, workflowStep: WorkflowStep });

    this.workflowButtonGroupService.createButtonCheckFormInvalid(this.form);
    this.workflowButtonGroupService.editButtonCheckFormInvalid(this.form);

    this.workflowButtonGroupService.checkPolicy(EntityType.certificate);
    this.workflowButtonGroupService.setEditMode(this.editMode);
  }

  handleError(error: any) {
    this.errorNotify({ detail: 'خطای نا مشخص', summary: 'رخداد خطا' });
    console.error(error);
  }

  ngOnDestroy(): void {
    this.compilationStatusValue = null;
  }

  get title() {
    return this.form.get('title');
  }

  get regulationTypeId() {
    return this.form.get('regulationTypeId');
  }

  get registerNo() {
    return this.form.get('registerNo');
  }

  get code() {
    return this.form.get('code');
  }

  get revisionLevelId() {
    return this.form.get('revisionLevelId');
  }

  get causeId() {
    return this.form.get('causeId');
  }

  get regulationAttachment() {
    return this.form.get('regulationAttachment');
  }

  get confidentialityId() {
    return this.form.get('confidentialityId');
  }

  get compilationStatusId() {
    return this.form.get('compilationStatusId');
  }

  get producerId() {
    return this.form.get('producerId');
  }

  get confirmerId() {
    return this.form.get('confirmerId');
  }

  get applicationLevelId() {
    return this.form.get('applicationLevelId');
  }

  get applicationAreaId() {
    return this.form.get('applicationAreaId');
  }

  private getLastStatus() {
    const statusId = this.certificate.lastStatus.statusId;
    this.basicValueService.getBasicInfo(statusId).subscribe(basicValue => {
      this.lastStatus = basicValue.title;
    });
  }
}
