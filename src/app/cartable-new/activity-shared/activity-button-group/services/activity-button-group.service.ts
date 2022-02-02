import { Injectable } from '@angular/core';
import { WorkflowButton } from '../../../../workflow/workflow-shared/workflow-button-group/models/workflow-button';

@Injectable({
  providedIn: 'root'
})
export class ActivityButtonGroupService {

  private _buttons: WorkflowButton[] = [];

  private _createButton: WorkflowButton | null = null;
  private _editButton: WorkflowButton | null = null;
  private _deleteButton: WorkflowButton | null = null;
  private _sendButton: WorkflowButton | null = null;
  private _acceptButton: WorkflowButton | null = null;
  private _unacceptButton: WorkflowButton | null = null;
  private _backButton: WorkflowButton | null = null;

  constructor() { }

  get buttons(): WorkflowButton[] { return this._buttons; }
  set buttons(buttons: WorkflowButton[]) {
    this._buttons = buttons;
  }

  get createButton(): WorkflowButton { return this._createButton; }
  set createButton(button: WorkflowButton) {
    this._createButton = button;
  }

  get editButton(): WorkflowButton { return this._editButton; }
  set editButton(button: WorkflowButton) {
    this._editButton = button;
  }

  get deleteButton(): WorkflowButton { return this._deleteButton; }
  set deleteButton(button: WorkflowButton) {
    this._deleteButton = button;
  }

  get sendButton(): WorkflowButton { return this._sendButton; }
  set sendButton(button: WorkflowButton) {
    this._sendButton = button;
  }

  get acceptButton(): WorkflowButton { return this._acceptButton; }
  set acceptButton(button: WorkflowButton) {
    this._acceptButton = button;
  }

  get unacceptButton(): WorkflowButton { return this._unacceptButton; }
  set unacceptButton(button: WorkflowButton) {
    this._unacceptButton = button;
  }

  get backButton(): WorkflowButton { return this._backButton; }
  set backButton(button: WorkflowButton) {
    this._backButton = button;
  }
}
