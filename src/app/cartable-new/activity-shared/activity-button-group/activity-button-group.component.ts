import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { WorkflowButton } from '../../../workflow/workflow-shared/workflow-button-group/models/workflow-button';
import { WorkflowButtonType } from '../../../workflow/workflow-shared/workflow-button-group/models/workflow-button-type.enum';
import { ActivityButtonGroupService } from './services/activity-button-group.service';

@Component({
  selector: 'app-activity-button-group',
  templateUrl: './activity-button-group.component.html',
  styleUrls: ['./activity-button-group.component.scss']
})
export class ActivityButtonGroupComponent extends BaseComponent implements OnInit {

  private actionTranslate: any;
  private _buttons: WorkflowButton[] = [];

  private _hasCreate: boolean = false;
  private _hasEdit: boolean = false;
  private _hasDelete: boolean = false;
  private _hasSend: boolean = false;
  private _hasAccept: boolean = false;
  private _hasUnaccept: boolean = false;
  private _hasBack: boolean = false;

  private _createButton: WorkflowButton | null = null;
  private _editButton: WorkflowButton | null = null;
  private _deleteButton: WorkflowButton | null = null;
  private _sendButton: WorkflowButton | null = null;
  private _acceptButton: WorkflowButton | null = null;
  private _unacceptButton: WorkflowButton | null = null;
  private _backButton: WorkflowButton | null = null;

  @Input()
  get buttons(): WorkflowButton[] { return this._buttons; }
  set buttons(buttons: WorkflowButton[]) {
    this._buttons = buttons;
    this._buttons.sort((a, b) => a.order > b.order ? 1 : -1);
    this.activityButtonGroupService.buttons = this._buttons;
  }

  @Input()
  get hasCreate(): boolean { return this._hasCreate; }
  set hasCreate(button: boolean) {
    this._hasCreate = button;
    this.addCreateButton();
  }

  @Input()
  get hasEdit(): boolean { return this._hasEdit; }
  set hasEdit(button: boolean) {
    this._hasEdit = button;
    this.addEditButton();
  }

  @Input()
  get hasDelete(): boolean { return this._hasDelete; }
  set hasDelete(button: boolean) {
    this._hasDelete = button;
    this.addDeleteButton();
  }

  @Input()
  get hasSend(): boolean { return this._hasSend; }
  set hasSend(button: boolean) {
    this._hasSend = button;
    this.addSendButton();
  }

  @Input()
  get hasAccept(): boolean { return this._hasAccept; }
  set hasAccept(button: boolean) {
    this._hasAccept = button;
    this.addAcceptButton();
  }

  @Input()
  get hasUnaccept(): boolean { return this._hasUnaccept; }
  set hasUnaccept(button: boolean) {
    this._hasUnaccept = button;
    this.addUnacceptButton();
  }

  @Input()
  get hasBack(): boolean { return this._hasBack; }
  set hasBack(button: boolean) {
    this._hasBack = button;
    this.addBackButton();
  }


  @Input()
  get createButton(): WorkflowButton { return this._createButton; }
  set createButton(button: WorkflowButton) {
    this._createButton = button;
    this.buttons = [...this.buttons, this._createButton];
    this.activityButtonGroupService.createButton = this._createButton;
  }

  @Input()
  get editButton(): WorkflowButton { return this._editButton; }
  set editButton(button: WorkflowButton) {
    this._editButton = button;
    this.buttons = [...this.buttons, this._editButton];
    this.activityButtonGroupService.editButton = this._editButton;
  }

  @Input()
  get deleteButton(): WorkflowButton { return this._deleteButton; }
  set deleteButton(button: WorkflowButton) {
    this._deleteButton = button;
    this.buttons = [...this.buttons, this._deleteButton];
    this.activityButtonGroupService.deleteButton = this._deleteButton;
  }

  @Input()
  get sendButton(): WorkflowButton { return this._sendButton; }
  set sendButton(button: WorkflowButton) {
    this._sendButton = button;
    this.buttons = [...this.buttons, this._sendButton];
    this.activityButtonGroupService.sendButton = this._sendButton;
  }

  @Input()
  get acceptButton(): WorkflowButton { return this._acceptButton; }
  set acceptButton(button: WorkflowButton) {
    this._acceptButton = button;
    this.buttons = [...this.buttons, this._acceptButton];
    this.activityButtonGroupService.acceptButton = this._acceptButton;
  }

  @Input()
  get unacceptButton(): WorkflowButton { return this._unacceptButton; }
  set unacceptButton(button: WorkflowButton) {
    this._unacceptButton = button;
    this.buttons = [...this.buttons, this._unacceptButton];
    this.activityButtonGroupService.unacceptButton = this._unacceptButton;
  }

  @Input()
  get backButton(): WorkflowButton { return this._backButton; }
  set backButton(button: WorkflowButton) {
    this._backButton = button;
    this.buttons = [...this.buttons, this._backButton];
    this.activityButtonGroupService.backButton = this._backButton;
  }

  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() send: EventEmitter<any> = new EventEmitter();
  @Output() accept: EventEmitter<any> = new EventEmitter();
  @Output() unaccept: EventEmitter<any> = new EventEmitter();
  @Output() back: EventEmitter<any> = new EventEmitter();

  constructor(private activityButtonGroupService: ActivityButtonGroupService) {
    super();

    this.translate.get('action').subscribe(res => {
      this.actionTranslate = res;
    });
  }

  ngOnInit(): void {

  }

  private addCreateButton() {
    this.createButton = {
      label: this.actionTranslate?.create,
      buttonType: WorkflowButtonType.create,
      onClick: ({ srcElementEvent }: { srcElementEvent: any }): void => {
        this.onCreate(srcElementEvent);
      },
      cssClass: 'ui-button-success col-sm-2',
      iconClass: 'pi pi-plus',
      order: 1
    } as WorkflowButton;
  }

  private addEditButton() {
    this.editButton = {
      label: this.actionTranslate?.edit,
      buttonType: WorkflowButtonType.edit,
      onClick: ({ srcElementEvent }: { srcElementEvent: any }): void => {
        this.onEdit(srcElementEvent);
      },
      cssClass: 'ui-button-primary col-sm-2',
      iconClass: 'pi pi-check',
      order: 2
    } as WorkflowButton;
  }

  private addDeleteButton() {
    this.deleteButton = {
      label: this.actionTranslate?.delete,
      buttonType: WorkflowButtonType.delete,
      onClick: ({ srcElementEvent }: { srcElementEvent: any }): void => {
        this.onDelete(srcElementEvent);
      },
      cssClass: 'ui-button-danger col-sm-1',
      iconClass: 'pi pi-trash',
      order: 3
    } as WorkflowButton;
  }

  private addSendButton() {
    this.sendButton = {
      label: this.actionTranslate?.send,
      buttonType: WorkflowButtonType.send,
      onClick: ({ srcElementEvent }: { srcElementEvent: any }): void => {
        this.onSend(srcElementEvent);
      },
      cssClass: 'ui-button-primary float-left col-sm-2',
      iconClass: 'fa fa-paper-plane',
      order: 6
    } as WorkflowButton;
  }

  private addAcceptButton() {
    this.acceptButton = {
      label: this.actionTranslate?.accept,
      buttonType: WorkflowButtonType.accept,
      onClick: ({ srcElementEvent }: { srcElementEvent: any }): void => {
        this.onAccept(srcElementEvent);
      },
      cssClass: 'ui-button-success float-left col-sm-2',
      iconClass: 'pi pi-check',
      order: 5
    } as WorkflowButton;
  }

  private addUnacceptButton() {
    this.unacceptButton = {
      label: this.actionTranslate?.unaccept,
      buttonType: WorkflowButtonType.unAccept,
      onClick: ({ srcElementEvent }: { srcElementEvent: any }): void => {
        this.onUnaccept(srcElementEvent);
      },
      cssClass: 'ui-button-danger float-left col-sm-2 mr-2',
      iconClass: 'pi pi-times',
      order: 4
    } as WorkflowButton;
  }

  private addBackButton() {
    this.backButton = {
      label: this.actionTranslate?.back,
      buttonType: WorkflowButtonType.back,
      onClick: ({ srcElementEvent }: { srcElementEvent: any }): void => {
        this.onBack(srcElementEvent);
      },
      cssClass: 'ui-button-secondary col-sm-1 mr-2',
      order: 7
    } as WorkflowButton;
  }

  onCreate(event: any) {
    this.create.emit(event);
  }

  onEdit(event: any) {
    this.edit.emit(event);
  }

  onDelete(event: any) {
    this.delete.emit(event);
  }

  onSend(event: any) {
    this.send.emit(event);
  }

  onAccept(event: any) {
    this.accept.emit(event);
  }

  onUnaccept(event: any) {
    this.unaccept.emit(event);
  }

  onBack(event: any) {
    this.back.emit(event);
  }

}
