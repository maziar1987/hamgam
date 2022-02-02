import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppFileManagerService } from 'src/app/app-file-manager/app-file-manager.service';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { WorkshopCertificate } from '../models/workshop-certificate-team';
import { WorkshopCertificateService } from '../workshop-certificate.service';

@Component({
  selector: 'app-workshop-certificate-edit',
  templateUrl: './workshop-certificate-edit.component.html',
  styleUrls: ['./workshop-certificate-edit.component.scss']
})
export class WorkshopCertificateEditComponent extends BaseComponent implements OnInit {

  hasCertificate: number;
  fullName: string;
  certificateId: number;
  teamMemberId: number;
  Workshopid: number;
  attachmentId: number;
  form: FormGroup;
  placement = 'bottom';
  attachmentFile: any;
  editMode = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    public appFileManager: AppFileManagerService,
    private workshopCertificateService: WorkshopCertificateService,
    private location: Location
  ) {
    super();
  }

  ngOnInit(): void {
    this.hasCertificate = 0;
    this.form = this.fb.group({
      accomplishmentDate: [null, [Validators.required]],
      expireDate: [null, [Validators.required]],
      certificateNO: [null, [Validators.required]],
      file: ['', [Validators.required]],
      description: ['']
    });
    this.activatedRoute.paramMap.subscribe(p => {
      this.certificateId = +p.get('id');
      this.teamMemberId = +p.get('teamid');
      this.fullName = p.get('name');
      this.Workshopid = +p.get('Workshopid');
      if (this.Workshopid > 0) {
        this.loadData();
      }

    });
  }

  loadData() {
    this.editMode = true;
    this.workshopCertificateService.getWorkshopById(this.Workshopid).subscribe(async res => {
      this.hasCer(res.hasCertificate)
      this.hasCertificate = (res.hasCertificate == true ? 1 : 0);
      this.description.setValue(res.description);
      this.accomplishmentDate.setValue(res.accomplishmentDate);
      this.expireDate.setValue(res.expireDate);
      this.certificateNO.setValue(res.certificateNO);
      if (res.fileId) {
        const attachmentFileData = `data:${res.file.dataContentType};base64,` + res.file.data;
        this.attachmentFile = await this.appFileManager.convertToFile(attachmentFileData, res.file);
        this.file.setValue(this.attachmentFile);
      }
      this.teamMemberId = res.teamMemberId;
      this.attachmentId = res.fileId;
    });
  }

  hasCer(a: boolean) {
    if (a) {
      this.accomplishmentDate.enable();
      this.expireDate.enable();
      this.certificateNO.enable();
      this.file.enable();
    } else {
      this.accomplishmentDate.disable();
      this.expireDate.disable();
      this.certificateNO.disable();
      this.file.disable();
    }


  }
  onSubmit() {
    const WorkshopCertificateAdd = {
      certificateId: this.certificateId,
      teamMemberId: this.teamMemberId,
      accomplishmentDate: this.accomplishmentDate.value,
      expireDate: this.expireDate.value,
      certificateNO: this.certificateNO.value,
      description: this.description.value,
      hasCertificate: this.isCertificate
    } as WorkshopCertificate;
    if (this.editMode) {
      WorkshopCertificateAdd.id = this.Workshopid;
      WorkshopCertificateAdd.fileId = this.attachmentId;
      this.workshopCertificateService.update(WorkshopCertificateAdd, this.attachmentFile).subscribe(res => {
        this.successNotify({ summary: 'عملیات موفق', detail: 'تغییرات ذخیره گردید' });
        this.location.back();
      }, error => {
        this.errorNotify({ summary: 'عملیات ناموفق', detail: 'خطا هنگام ویرایش' });
      });
    } else {
      this.workshopCertificateService.save(WorkshopCertificateAdd, this.attachmentFile).subscribe(res => {
        this.successNotify({ summary: 'عملیات موفق', detail: 'ثبت با موفقیت انجام شد' });
        this.location.back();
      }, error => {
        this.errorNotify({ summary: 'عملیات ناموفق', detail: 'خطا هنگام ثبت' });
      });
    }
  }

  onBack() { this.location.back(); }

  get isCertificate() { return this.hasCertificate == 0 ? false : true; }

  onUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.file.setValue(event.target.files[0]);
      this.attachmentFile = event.target.files[0];
      if (this.editMode) { this.attachmentId = null; }
    }
    event.srcElement.value = null;


  }

  onRemoveUpload() {
    this.attachmentFile = null;
    this.file.setValue(null);
    if (this.editMode) { this.attachmentId = null; }
  }

  get accomplishmentDate() { return this.form.get('accomplishmentDate'); }
  get expireDate() { return this.form.get('expireDate'); }
  get certificateNO() { return this.form.get('certificateNO'); }
  get file() { return this.form.get('file'); }
  get description() { return this.form.get('description'); }

}
