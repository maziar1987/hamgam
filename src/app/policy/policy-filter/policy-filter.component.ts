import {
  AfterViewChecked, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {QueryBuilderConfig} from 'angular2-query-builder';
import {ActionsModel} from '../models/actions.model';
import {ElementPolicyModel} from '../models/element.policy.model';
import {RuleModel} from '../models/rule.model';

@Component({
  selector: 'app-policy-filter',
  templateUrl: './policy-filter.component.html',
  styleUrls: ['./policy-filter.component.scss']
})
export class PolicyFilterComponent implements OnChanges, AfterViewChecked {
  @Input() visible: boolean;
  @Input() selectedNode: ElementPolicyModel;
  @Input() action: ActionsModel;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() createdQuery: EventEmitter<any> = new EventEmitter();
  query = {};

  config: QueryBuilderConfig = {
    fields: {}
  };

  constructor(private changeRef: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedNode) {
      this.selectedNode = changes.selectedNode.currentValue;
      if (this.selectedNode) {
        const a = this.selectedNode.actions.find(item => item.name === this.selectedNode.type);
        const fields = a.fields;
        fields.forEach((item) => {
          item.type = item.type.toLowerCase();
          this.config.fields[item.name] = Object.assign(item);
        });
      }
    }
    if (changes.action) {
      if (this.action.attributes) {
        this.query = this.action.attributes.query;
      }
    }
  }

  ngAfterViewChecked(): void {
    this.changeRef.detectChanges();
  }

  hide() {
    this.visibleChange.emit(false);
    this.visible = false;
    this.config.fields = {};
  }

  submit(query) {
    this.createdQuery.emit(query);
    this.visible = false;
  }

  onBack() {
    this.visibleChange.emit(false);
    this.visible = false;
    this.config.fields = {};
  }
}
