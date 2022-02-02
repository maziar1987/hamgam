import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { BasicValueType } from 'src/app/basicinfo/basic-value/basic-value.model';
import { WorkflowButtonGroupService } from 'src/app/workflow/workflow-shared/workflow-button-group/services/workflow-button-group.service';
import { WorkflowStep } from '../../models';
import { WorkflowActivitySendVisibility, WorkflowButtonEvent } from '../workflow-button-group/models';
import { WorkflowButtonGroupInfo } from '../workflow-button-group/models/workflow-button-group-info';

@Component({
  selector: 'app-workflow-create-activity-modal',
  templateUrl: './workflow-create-activity-modal.component.html',
  styleUrls: ['./workflow-create-activity-modal.component.scss']
})
export class WorkflowCreateActivityModalComponent extends BaseComponent implements OnInit, OnDestroy {

  display: boolean = false;
  header: string | null = null;

  onClick: (event: WorkflowButtonEvent) => void;
  showCreateActivitySubscription: Subscription;
  workflowInfoSubscription: Subscription;
  showCreateActivityVisibilitySubscription: Subscription;

  workflowInfo: WorkflowButtonGroupInfo;

  visibility: WorkflowActivitySendVisibility;

  constructor(
    private formbuilder: FormBuilder,
    private workflowButtonGroupService: WorkflowButtonGroupService
  ) {
    super();

    this.setVisibility();
    this.createForm();

    this.showCreateActivitySubscription = workflowButtonGroupService.showCreateActivity$.subscribe(activity => {
      this.display = activity?.showCreateActivity;
      this.onClick = activity?.onClick;
    });

    this.showCreateActivityVisibilitySubscription = workflowButtonGroupService.showCreateActivityVisibility$.subscribe(res => {
      if (res) {
        this.visibility = res;
      } else {
        this.setVisibility();
      }
    });

    this.workflowInfoSubscription = workflowButtonGroupService.workflowInfo$.subscribe(info => {
      this.workflowInfo = info;
      this.setHeader(this.workflowInfo);
    });
  }

  private setVisibility() {
    this.visibility = {
      classification: true,
      deadline: true,
      priority: true,
      subject: true,
      text: true
    };
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.showCreateActivitySubscription.unsubscribe();
    this.workflowInfoSubscription.unsubscribe();
  }

  get subject() { return this.form.get('subject'); }
  get text() { return this.form.get('text'); }
  get priorityId() { return this.form.get('priorityId'); }
  get classificationId() { return this.form.get('classificationId'); }
  get deadline() { return this.form.get('deadline'); }

  private createForm() {
    this.form = this.formbuilder.group({
      subject: [null, Validators.required],
      text: [null],
      priorityId: [null],
      classificationId: [null],
      deadline: [null]
    });
  }

  private setHeader(workflowInfo: WorkflowButtonGroupInfo) {
    switch (workflowInfo?.workflowStep) {
      case WorkflowStep.Create:
      case WorkflowStep.Edit:
        this.header = 'ارسال به ناظر خبره';
        this.subject.setValue('بررسی فرد خیره');
        break;

      default:
        this.header = 'ارسال';
        break;
    }
  }

  getBasicValueType(basicValueType: string) {
    return BasicValueType[basicValueType];
  }

  onHide(event) {
    this.workflowButtonGroupService.hideCreateActivity();
  }

  onSubmit(event) {
    this.onClick({
      srcElementEvent: event,
      activity: {
        subject: this.subject.value,
        text: this.text.value,
        priorityId: this.priorityId.value,
        classificationId: this.classificationId.value,
        deadline: this.deadline.value
      }
    });
    this.onHide(null);
  }

  onCancel() {
    this.onHide(null);
  }

}
