import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { AcceptComponent } from 'src/app/app-shared/components/accept/accept.component';
import { LoggerService } from 'src/app/app-shared/services/logger.service';
import { BasicValue } from '../basic-value.model';
import { BasicValueService } from '../basic-value.service';

@Component({
  selector: 'app-basic-value-detail',
  templateUrl: './basic-value-detail.component.html',
  styleUrls: ['./basic-value-detail.component.scss']
})
export class BasicValueDetailComponent extends BaseComponent {

  @ViewChild('accept_modal') accept_modal: AcceptComponent;

  basicInfo: BasicValue = <BasicValue>{};

  constructor(
    public dialogService: DialogService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private logger: LoggerService,
    private service: BasicValueService,
  ) {

    super();

    // create an empty object
    this.basicInfo = <BasicValue>{};

    if (this.config.data.id)
      var id: number = +this.config.data.id;

    // fetch the value from the service
    this.service.getBasicInfo(id).subscribe(res => {
      this.basicInfo = res;

    }, error => {
      this.handleError(error);
    });

  }

  handleError(error: any, id?: number) {

    if (error instanceof HttpErrorResponse) {

      this.logger.error(error);
    }
  }

  onDelete() {
    if (!this.basicInfo.readonly) {
      this.accept_modal.show(this.basicInfo.title + ' حذف شود؟', this.basicInfo);
    } else {
      this.errorNotify({ detail: "امکان حذف برای مقادیر ثابت وجود ندارد", summary: 'رویداد خطا' });
    }
  }

  delete(event) {
    if (event.readonly) {
      this.service.deleteBasicInfo(event.id).subscribe(res => {
        this.successNotify({ detail: 'حذف انجام شد', summary: 'عملیات موفق' });
        this.onBack();
      }, error => {
        this.handleError(error);
      });
    }
  }

  onBack() {
    this.ref.close();
  }
}
