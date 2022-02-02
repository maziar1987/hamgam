import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { WorkflowButton } from './models';
import { WorkflowButtonGroupService } from './services/workflow-button-group.service';

@Component({
  selector: 'app-workflow-button-group',
  templateUrl: './workflow-button-group.component.html',
  styleUrls: ['./workflow-button-group.component.scss']
})
export class WorkflowButtonGroupComponent extends BaseService implements OnInit {

  buttons$: Observable<WorkflowButton[]>;
  buttonsLength$: Observable<number>;
  isLoading$: Observable<boolean>;

  constructor(
    private service: WorkflowButtonGroupService) {
    super();

    this.buttons$ = service.buttons$;
    this.buttonsLength$ = service.buttonsLength$;
    this.isLoading$ = this.service.isLoading$;
  }

  ngOnInit(): void {
  }

}
