import { Component, OnInit } from '@angular/core';
import { DefaultTextService } from '../../services/defaultText.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-activity-default-text-delete',
  templateUrl: './activity-default-text-delete.component.html',
  styleUrls: ['./activity-default-text-delete.component.scss']
})
export class ActivityDefaultTextDeleteComponent implements OnInit {

  constructor(private service: DefaultTextService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig) { }

  ngOnInit(): void {
  }
  delete() {
    //this.data=<Template>{subject:this.subject,text:this.subject};
    this.service.delete(this.config.data.id).subscribe(a => {
      this.ref.close(this.config.data.id);
    })

  }
  close() {
    this.ref.close();
  }
}
