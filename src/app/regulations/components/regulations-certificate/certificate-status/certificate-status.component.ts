import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {DialogService} from 'primeng/dynamicdialog';
import {AppFileManagerService} from '../../../../app-file-manager/app-file-manager.service';
import {BasicValue, BasicValueType} from '../../../../basicinfo/basic-value/basic-value.model';
import {BasicValueService} from '../../../../basicinfo/basic-value/basic-value.service';
import {OrgunitService} from '../../../../basicinfo/orgunit/orgunit.service';
import {FormContainerChildBaseComponent} from '../../../../form-container/models/form-container-child-base-component';
import {UserService} from '../../../../user/user.service';
import {CertificateStatus} from './certificate-status.model';
import {CertificateStatusService} from './certificate-status.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng';
import {BaseComponent} from '../../../../app-shared/base/base.component';

@Component({
  selector: 'app-certificate-status',
  templateUrl: './certificate-status.component.html',
  styleUrls: ['./certificate-status.component.scss']
})
export class CertificateStatusComponent extends BaseComponent implements OnInit, OnDestroy {
  certificateStatus: CertificateStatus;
  selectedBasicValueType: BasicValue;
  placement = 'bottom';
  attachmentFile: any;
  prepareDateVisible = false;
  attachmentVisible = false;
  revisionVisible = false;
  estimateVisible = false;
  causeVisible = false;
  editMode = false;
  viewMode = false;

  constructor(public appFileManager: AppFileManagerService,
              private basicValueService: BasicValueService,
              private fb: FormBuilder,
              private statusService: CertificateStatusService,
              public dialogService: DialogService,
              public config: DynamicDialogConfig,
              public ref: DynamicDialogRef) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    this.changeField(BasicValueType.statusAvailable);
    if (this.config.data) {
      this.loadData(this.config.data.id);
      if(this.config.data.readOnly){
        this.viewMode = this.config.data.readOnly;
      }
    }
  }

  loadData(statusId: number) {
    this.statusService.get(statusId).subscribe(status => {
      this.certificateStatus = status;
      this.appFileManager.getFile(this.certificateStatus.attachment?.id).subscribe(async (attachment) => {
        this.certificateStatus.attachment = attachment;
        const attachmentFileData = `data:${attachment.dataContentType};base64,` + attachment.data;

        this.attachmentFile = await this.appFileManager.convertToFile(attachmentFileData, this.certificateStatus.attachment);
      });
      this.updateForm();
      this.changeField(status.statusId);
      this.editMode = true;
    }, error => {
      console.log(error);
    });
  }

  private createForm() {
    this.form = this.fb.group({
      statusId: [BasicValueType.statusRequired, Validators.compose([Validators.required])],
      causeId: [null, Validators.compose([Validators.required])],
      revisionCauseId: [null, Validators.compose([Validators.required])],
      prepareDate: [null],
      timeEstimate: [null, Validators.compose([Validators.required])],
      creditEstimate: [null, Validators.compose([Validators.required])],
      revisionLevelId: [null, Validators.compose([Validators.required])],
      attachment: [null, Validators.compose([Validators.required])],
      description: [null]
    });
  }

  updateForm() {
    this.form.controls.statusId.setValue(this.certificateStatus.statusId);
    this.form.controls.causeId.setValue(this.certificateStatus.causeId);
    this.form.controls.revisionCauseId.setValue(this.certificateStatus.revisionCauseId);
    this.form.controls.prepareDate.setValue(this.certificateStatus.prepareDate);
    this.form.controls.timeEstimate.setValue(this.certificateStatus.timeEstimate);
    this.form.controls.creditEstimate.setValue(this.certificateStatus.creditEstimate);
    this.form.controls.revisionLevelId.setValue(this.certificateStatus.revisionLevelId);
    this.form.controls.attachment.setValue(this.certificateStatus.attachment);
    this.form.controls.description.setValue(this.certificateStatus.description);
  }

  onSave() {
    this.ref.close(this.form);
  }

  getBasicValueType(basicValueType: string) {
    return BasicValueType[basicValueType];
  }

  selectBasicValueType(event: BasicValue) {
    this.selectedBasicValueType = event;
  }

  selectStatusValueType(event: BasicValue) {
    this.selectedBasicValueType = event;
    this.changeField(event.id);
  }

  changeField(id: number) {
    switch (id) {
      case BasicValueType.statusAvailable:
        this.prepareDateVisible = true;
        this.attachmentVisible = true;
        this.revisionVisible = false;
        this.estimateVisible = false;
        this.causeVisible = true;
        this.form.get('causeId').enable();
        this.form.get('attachment').enable();
        this.form.get('creditEstimate').disable();
        this.form.get('timeEstimate').disable();
        this.form.get('revisionCauseId').disable();
        this.form.get('revisionLevelId').disable();
        break;
      case BasicValueType.statusReview:
        this.prepareDateVisible = false;
        this.attachmentVisible = true;
        this.estimateVisible = true;
        this.revisionVisible = true;
        this.causeVisible = false;
        this.form.get('creditEstimate').enable();
        this.form.get('timeEstimate').enable();
        this.form.get('revisionCauseId').enable();
        this.form.get('revisionLevelId').enable();
        this.form.get('attachment').enable();
        this.form.get('causeId').disable();
        break;
      case BasicValueType.statusRequired:
        this.prepareDateVisible = false;
        this.attachmentVisible = false;
        this.estimateVisible = true;
        this.revisionVisible = false;
        this.causeVisible = true;
        this.form.get('creditEstimate').enable();
        this.form.get('timeEstimate').enable();
        this.form.get('causeId').enable();
        this.form.get('attachment').disable();
        this.form.get('revisionCauseId').disable();
        this.form.get('revisionLevelId').disable();
        break;
    }
  }

  onUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.attachmentFile = event.target.files[0];
      this.form.controls.attachment.setValue(this.attachmentFile);
      this.form.get('attachment').disable();
    }
    event.srcElement.value = null;
  }

  onCancel() {
    this.ref.close(this.certificateStatus);
  }

  onRemoveUpload() {
    this.attachmentFile = null;
  }

  get attachmentFileName() {
    return this.attachmentFile instanceof File ? this.attachmentFile?.name : this.certificateStatus?.attachment?.fileName;
  }

  ngOnDestroy(): void {
  }

  get statusId() {
    return this.form.get('statusId');
  }

  get causeId() {
    return this.form.get('causeId');
  }

  get revisionLevelId() {
    return this.form.get('revisionLevelId');
  }

  get revisionCauseId() {
    return this.form.get('revisionCauseId');
  }

  get timeEstimate() {
    return this.form.get('timeEstimate');
  }

  get creditEstimate() {
    return this.form.get('creditEstimate');
  }

  get prepareDate() {
    return this.form.get('prepareDate');
  }
}
