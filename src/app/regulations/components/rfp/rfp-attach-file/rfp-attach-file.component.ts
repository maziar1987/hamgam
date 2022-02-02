import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng';
import { AppFileManagerService } from 'src/app/app-file-manager/app-file-manager.service';
import { AppFile } from 'src/app/app-file-manager/app-file.model';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { Attachment } from '../rfp.model';

@Component({
  selector: 'app-rfp-attach-file',
  templateUrl: './rfp-attach-file.component.html',
  styleUrls: ['./rfp-attach-file.component.scss']
})
export class RfpAttachFileComponent extends BaseComponent implements OnInit {
  attach: File;
  public form: FormGroup;
  attachRfp: Attachment = {} as Attachment;
  constructor(
    public appFileManager: AppFileManagerService,
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      file: ['', [Validators.required]],
    });
  }
  get title() { return this.form.get('title'); }
  get description() { return this.form.get('description'); }
  get file() { return this.form.get('file'); }
  onUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.file.setValue(event.target.files[0]);
      this.attach = event.target.files[0];
    }
    event.srcElement.value = null;
  }

  onRemoveUpload() {
    this.file.setValue(null);
    this.attach = null;
  }


  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.attachRfp.title = this.title.value;
    this.attachRfp.description = this.description.value;
    this.attachRfp.file = {} as AppFile;
    this.attachRfp.file.data = this.file.value;
    this.ref.close(this.attachRfp);
  }
  onBack() {
    this.ref.close();
  }

}
