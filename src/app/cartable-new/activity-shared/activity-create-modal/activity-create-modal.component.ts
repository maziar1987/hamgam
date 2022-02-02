import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { BasicValue, BasicValueType } from 'src/app/basicinfo/basic-value/basic-value.model';
import { BasicValueService } from 'src/app/basicinfo/basic-value/basic-value.service';
import { Activity, DefaultText } from '../../models';

@Component({
  selector: 'app-activity-create-modal',
  templateUrl: './activity-create-modal.component.html',
  styleUrls: ['./activity-create-modal.component.scss']
})
export class ActivityCreateModalComponent extends BaseComponent implements OnInit {

  @Input() display: boolean = false;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Input() action: string | null = null;
  @Output() submit: EventEmitter<{ action: string, activity: Activity }> = new EventEmitter();

  priorities: BasicValue[] = [];
  classifications: BasicValue[] = [];

  constructor(
    private formbuilder: FormBuilder,
    private basicValueService: BasicValueService) {
    super();
    this.createForm();
  }

  ngOnInit(): void {
    this.loadBasicvalues()
  }

  loadBasicvalues() {
    this.basicValueService.getBasicInfo(BasicValueType.classification).subscribe(res => {
      this.classifications = res.children;
    }, error => {
      console.error(error);
    });
    this.basicValueService.getBasicInfo(BasicValueType.priority).subscribe(res => {
      this.priorities = res.children;
    }, error => {
      console.error(error);
    });
  }

  // get sendType() { return this.form.get('sendType'); }
  get text() { return this.form.get('text'); }
  get subject() { return this.form.get('subject'); }
  // get receivers() { return this.form.get('receivers'); }
  // get receiverCCs() { return this.form.get('receiverCCs'); }
  // get receiverBCCs() { return this.form.get('receiverBCCs'); }
  // get attachments() { return this.form.get('attachments'); }
  get priority() { return this.form.get('priority'); }
  get classification() { return this.form.get('classification'); }

  private createForm() {
    this.form = this.formbuilder.group({
      // sendType: [SendType[SendType.COMPOSE], [Validators.required]],
      text: [''],
      subject: [''],
      // receivers: [null, Validators.required],
      // receiverCCs: [null],
      // receiverBCCs: [null],
      // attachments: [null],
      priority: [null, Validators.required],
      classification: [null, Validators.required]
    });
  }

  showDialog() {
    this.display = true;
    this.displayChange.emit(this.display);
  }

  onSubmit() {
    this.display = false;
    this.submit.emit({
      action: this.action,
      activity: <Activity>{
        text: this.text.value,
        subject: this.subject.value,
        classification: this.classification.value,
        classificationId: this.classification.value?.id,
        priority: this.priority.value,
        priorityId: this.priority.value?.id
      }
    });
  }

  onHide(event) {
    this.displayChange.emit(this.display);
  }

  onCancel() {
    this.display = false;
  }

  defaultTextSelected(defaultText: DefaultText) {
    this.text.setValue(`${this.text.value}<p class='ql-align-right'>${defaultText.text}</p>`);
  }

}
