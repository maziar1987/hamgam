import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-activity-default-text-create',
  templateUrl: './activity-default-text-create.component.html',
  styleUrls: ['./activity-default-text-create.component.scss']
})

export class ActivityDefaultTextCreateComponent implements OnInit {

  title: string;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig) { }

  ngOnInit(): void {
  }

  save() {
    this.ref.close(this.title);    
  }

  close() {
    this.ref.close();
  }
}
