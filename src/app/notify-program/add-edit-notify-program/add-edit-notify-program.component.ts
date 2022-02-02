import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeNode } from 'primeng';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppFileManagerService } from '../../app-file-manager/app-file-manager.service';
import { AcceptComponent } from '../../app-shared/components/accept/accept.component';
import { BasicValue, BasicValueType } from '../../basicinfo/basic-value/basic-value.model';
import { BasicValueService } from '../../basicinfo/basic-value/basic-value.service';
import { OrgUnitService } from '../../basicinfo/org-unit/services/org-unit.service';
import { Orgunit } from '../../basicinfo/orgunit/orgunit.model';
import { FormContainerChildBaseComponent } from '../../form-container/models/form-container-child-base-component';
import { CertificateViewDialogComponent } from '../../regulations/components/regulations-certificate/certificate-view-dialog/certificate-view-dialog.component';
import { RegulationCertificateService } from '../../regulations/components/regulations-certificate/regulation-certificate.service';
import { CertificateView, NotifyCertificate, NotifyProgram } from '../model/notify-program.model';
import { RegulationSelectInfoComponent } from '../regulation-select-info/regulation-select-info.component';
import { NotifyProgramService } from '../service/notify-program.service';

@Component({
  selector: 'app-add-edit-notify-program',
  templateUrl: './add-edit-notify-program.component.html',
  styleUrls: ['./add-edit-notify-program.component.scss']
})
export class AddEditNotifyProgramComponent extends FormContainerChildBaseComponent implements OnInit {

  @ViewChild('accept_modal') accept_modal: AcceptComponent;

  selectedOrgUnit: Orgunit;
  displayOrgUnitTree = false;
  selectedNode: TreeNode;
  attachmentFile: any;
  notifyProgram: NotifyProgram;
  notifyCertificates: NotifyCertificate[];
  certificateViews: CertificateView[] = [];
  selection: CertificateView[] = [];
  regulationStatusBasicValues: BasicValue;
  regulationTypeBasicValues: BasicValue;
  ref: DynamicDialogRef;
  editMode = false;

  private _location: Location;

  constructor(
    private location: Location,
    public appFileManager: AppFileManagerService,
    public fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialogService: DialogService,
    public notifyService: NotifyProgramService,
    private route: ActivatedRoute,
    public orgUnitService: OrgUnitService,
    private basicValueService: BasicValueService,
    private certificateService: RegulationCertificateService) {
    super();
    this.basicValueService.getBasicInfo(BasicValueType.regulationStatus).subscribe(values => {
      this.regulationStatusBasicValues = values;
    });
    this.basicValueService.getBasicInfo(BasicValueType.regulationType).subscribe(values => {
      this.regulationTypeBasicValues = values;
    });
    this._location = location;
  }

  ngOnInit(): void {
    this.createForm();
    this.route.params.subscribe(params => {
      if (Object.keys(params).length !== 0) {
        this.loadData(params.id);
      }
    });
  }

  loadData(id: number) {
    this.notifyService.get(id).subscribe(notify => {
      this.notifyProgram = notify;
      this.updateForm();
      this.editMode = true;
    });
  }

  updateForm() {
    this.form.controls.id.setValue(this.notifyProgram.id);
    this.form.controls.orgUnitId.setValue(this.notifyProgram.orgUnitId);
    this.form.controls.letterNo.setValue(this.notifyProgram.letterNo);
    this.form.controls.programYear.setValue(this.notifyProgram.programYear);
    this.form.controls.attachment.setValue(this.notifyProgram.attachment);
    this.orgUnitService.getOrgUnit(this.notifyProgram.orgUnitId).subscribe(res => {
      this.selectedOrgUnit = res;
    });
    this.bindDataToLoadCertificate();
    if (this.notifyProgram.attachment.id) {
      this.appFileManager.getFile(this.notifyProgram.attachment.id).subscribe(async (res) => {

        this.notifyProgram.attachment = res;
        const attachmentFileData = `data:${res.dataContentType};base64,` + res.data;

        this.attachmentFile = await this.appFileManager.convertToFile(attachmentFileData, this.notifyProgram.attachment);
      });
    }
  }

  bindDataToLoadCertificate() {
    this.certificateViews = [];
    let statusDesc, regulationType;
    const certificateIds = [...new Set(this.notifyProgram.notifyCertificates.map(({ certificateId }) => certificateId))];
    this.certificateService.get(certificateIds).subscribe(certificates => {
      this.notifyProgram.notifyCertificates.forEach(notify => {
        statusDesc = this.regulationStatusBasicValues.children.find(bi => bi.id === (certificates.find(x => x.id === notify.certificateId).lastStatus.statusId)).title;
        regulationType = this.regulationTypeBasicValues.children.find(bi => bi.id === (certificates.find(x => x.id === notify.certificateId).regulationTypeId)).title;
        this.certificateViews.push({
          id: notify.id,
          title: certificates.find(x => x.id === notify.certificateId).title,
          status: statusDesc,
          type: regulationType,
          notifyId: this.notifyProgram.id,
          certificateId: notify.certificateId,
          description: notify.description,
          selected: null,
          code: notify.code,
          registerNo: notify.registerNo
        });
      });
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [''],
      orgUnitId: [null, Validators.compose([Validators.required])],
      letterNo: [null, Validators.compose([Validators.required])],
      programYear: [null, Validators.compose([Validators.required])],
      attachment: [null, Validators.compose([Validators.required])]
    });
  }

  onSubmit() {
    this.bindDataToSaveCertificate();
    const prop = {
      id: this.notifyProgram?.id,
      orgUnitId: this.orgUnitId.value,
      letterNo: this.letterNo.value,
      programYear: this.programYear.value,
      attachment: this.attachmentFile,
      notifyCertificates: this.notifyCertificates
    } as NotifyProgram;
    if (this.editMode) {
      this.notifyService.update(prop, this.attachmentFile).subscribe(notify => {
        this.successNotify({ detail: 'تغییرات ذخیره گردید', summary: 'عملیات موفق' });
        this.loadData(notify.id);
      }, error => {
        this.errorNotify({ detail: 'خطا هنگام ویرایش', summary: 'عملیات ناموفق' });
      });
    } else {
      this.notifyService.save(prop, this.attachmentFile).subscribe(notify => {
        this.successNotify({ detail: 'ثبت با موفقیت انجام شد', summary: 'عملیات موفق' });
        this.loadData(notify.id);
      }, error => {
        this.errorNotify({ detail: 'خطا هنگام ذخیره اطلاعات', summary: 'رخداد خطا' });
      });
    }
  }

  bindDataToSaveCertificate() {
    this.notifyCertificates = [];
    this.certificateViews.forEach(value => {
      this.notifyCertificates.push({
        id: value?.id,
        certificateId: value.certificateId,
        description: value.description,
        notifyProgramId: value.notifyId,
        code: value.code,
        registerNo: value.registerNo
      });
    });
  }

  onBack() {
    this._location.back();
  }

  addCertificate() {
    this.certificateViews.forEach(value => {
      this.selection.push({
        id: value.certificateId,
        certificateId: value.certificateId,
        title: value.title,
        selected: value.selected,
        description: value.description,
        status: value.status,
        type: value.type,
        notifyId: value.notifyId,
        registerNo: value.registerNo,
        code: value.code
      });
    });
    this.ref = this.dialogService.open(RegulationSelectInfoComponent, {
      data: { orgUnitId: this.orgUnitId.value, selections: this.selection },
      width: '70%',
      contentStyle: { 'max-height': '650px', overflow: 'auto', direction: 'rtl', 'text-align': 'right' }
    });
    this.ref.onClose.subscribe((certificateView: CertificateView[]) => {
      if (certificateView != null) {
        const tempCertificate = [];
        certificateView.forEach(value => {
          const exist = this.certificateViews.find(x => x.certificateId === value.certificateId);
          if (exist) {
            tempCertificate.push(exist);
          }
        });
        this.certificateViews = [];
        certificateView.forEach(value => {
          value.id = null;
          const exist = tempCertificate.find(x => x.certificateId === value.certificateId);
          if (exist) {
            this.certificateViews.push(exist);
          } else {
            this.certificateViews.push(value);
          }
        });
      }
    });
  }

  showOrgUnitTreeDialog() {
    this.displayOrgUnitTree = true;
  }

  nodeSelect(event: TreeNode) {
    this.selectedNode = event;
  }

  selectOrgUnit() {
    this.selectedOrgUnit = this.selectedNode.data;
    this.form.controls.orgUnitId.setValue(this.selectedOrgUnit.id);
    this.displayOrgUnitTree = false;
  }

  closeOrgUnitTreeDialog() {
    this.selectedOrgUnit = null;
    this.orgUnitId.reset();
    this.displayOrgUnitTree = false;
  }

  onUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.attachmentFile = event.target.files[0];
      this.form.controls.attachment.setValue(this.attachmentFile);
      this.form.get('attachment').disable();
    }
    event.srcElement.value = null;
  }

  getMenuItems(rowData) {
    const items = [
      {
        label: 'مشاهده آیین نامه', icon: '', command: () => {
          this.onViewRegulation(rowData);
        }
      }, {
        label: 'حذف', icon: '', command: () => {
          this.onDelete(rowData);
        }
      }
    ] as MenuItem[];
    return items;
  }

  onViewRegulation(rowNode) {
    this.ref = this.dialogService.open(CertificateViewDialogComponent, {
      data: { certificateId: rowNode.certificateId },
      width: '70%',
      contentStyle: { 'max-height': '650px', overflow: 'auto', direction: 'rtl', 'text-align': 'right' }
    });
  }

  onDelete(rowNode) {
    this.translate.get('message.delete').subscribe(res => {
      this.accept_modal.show(rowNode.title + res.deleted, rowNode);
    });

  }

  delete(event) {
    this.certificateViews = this.certificateViews.filter(x => x.certificateId !== event.certificateId);
    this.successNotify({ detail: 'حذف با موفقیت انجام شد.', summary: 'عملیات موفق' });
  }

  onRemoveUpload() {
    this.attachmentFile = null;
    this.form.get('attachment').enable();
  }

  get attachmentFileName() {
    return this.attachmentFile instanceof File ? this.attachmentFile?.name : this.notifyProgram?.attachment?.fileName;
  }

  get orgUnitId() {
    return this.form.get('orgUnitId');
  }

  get programYear() {
    return this.form.get('programYear');
  }

  get letterNo() {
    return this.form.get('letterNo');
  }

}
