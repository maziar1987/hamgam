import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseComponent } from 'src/app/app-shared/base/base.component';


@Component({
  selector: 'app-get-folder-name',
  templateUrl: './get-folder-name.component.html',
  styleUrls: ['./get-folder-name.component.scss']
})
export class GetFolderNameComponent extends BaseComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) { super(); }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      folderName: ['', [Validators.required, Validators.maxLength(255)]],
    });
  }

  handleError(error: any) {
    throw new Error("Method not implemented.");
  }

  onSubmit(input: any) {
    if (this.form.valid) {
      this.ref.close(input.folderName);
    }
    else {
      this.warningNotify({ detail: "اطلاعات را به درستی وارد نمایید.", summary: "اخطار" });
    }
  }

  onCancel() {
    this.ref.close();
  }

}
