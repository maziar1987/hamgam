import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { EntityTypePermition } from 'src/app/policy/models/entity-type-permition';
import { EntityType } from 'src/app/policy/models/entity-type.enum';
import { PolicySetService } from 'src/app/policy/services/policy-set.service';
import { WorkflowActivitySendVisibility, WorkflowButton, WorkflowButtonType } from '../models';
import { WorkflowButtonGroupInfo } from '../models/workflow-button-group-info';
import { WorkflowSendButton } from '../models/workflow-send-button';

@Injectable()
export class WorkflowButtonGroupService extends BaseService implements OnDestroy {

  private actionTranslate: any;
  private entityTypePermitions: EntityTypePermition[] | null = null;

  private _editMode$ = new BehaviorSubject<boolean>(false);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isShowCreateActivity$ = new BehaviorSubject<boolean>(true);
  private _showCreateActivity$ = new BehaviorSubject<WorkflowSendButton | null>(null);
  private _showCreateActivityVisibility$ = new BehaviorSubject<WorkflowActivitySendVisibility | null>(null);
  private _workflowInfo$ = new BehaviorSubject<WorkflowButtonGroupInfo | null>(null);

  private _buttons$ = new BehaviorSubject<WorkflowButton[]>([]);
  private _buttonsLength$ = new BehaviorSubject<number>(0);

  private _isCreate: boolean = false;
  private _isEdit: boolean = false;
  private _isDelete: boolean = false;
  private _isSend: boolean = false;
  private _isSubmitAndSend: boolean = false;
  private _isAccept: boolean = false;
  private _isUnaccept: boolean = false;
  private _isReturn: boolean = false;
  private _isBack: boolean = false;

  private _createButton: WorkflowButton | null = null;
  private _editButton: WorkflowButton | null = null;
  private _deleteButton: WorkflowButton | null = null;
  private _sendButton: WorkflowButton | null = null;
  private _submitAndSendButton: WorkflowButton | null = null;
  private _acceptButton: WorkflowButton | null = null;
  private _unacceptButton: WorkflowButton | null = null;
  private _returnButton: WorkflowButton | null = null;
  private _backButton: WorkflowButton | null = null;

  private _createButtonDisabled: boolean = false;
  private _editButtonDisabled: boolean = false;
  private _deleteButtonDisabled: boolean = false;
  private _sendButtonDisabled: boolean = false;
  private _acceptButtonDisabled: boolean = false;
  private _unacceptButtonDisabled: boolean = false;
  private _returnButtonDisabled: boolean = false;

  constructor(
    private http: HttpClient,
    private injector: Injector,
    private policyService: PolicySetService) {
    super();

    const translate = this.injector.get(TranslateService);

    translate.get('action').subscribe(res => {
      this.actionTranslate = res;
    });

    this._buttons$.subscribe(x => this._buttonsLength$.next(x.length));
  }

  ngOnDestroy(): void {
    console.log("destroy");
  }


  get editMode$() { return this._editMode$.asObservable(); }

  get buttons$() { return this._buttons$.asObservable(); }
  get buttonsLength$() { return this._buttonsLength$.asObservable(); }
  get isLoading$() { return this._isLoading$.asObservable(); }
  get isShowCreateActivity$() { return this._isShowCreateActivity$.asObservable(); }
  get showCreateActivity$() { return this._showCreateActivity$.asObservable(); }
  get showCreateActivityVisibility$() { return this._showCreateActivityVisibility$.asObservable(); }
  get workflowInfo$() { return this._workflowInfo$.asObservable(); }


  get isCreate() { return this._isCreate; }
  get isEdit() { return this._isEdit; }
  get isDelete() { return this._isDelete; }
  get isSend() { return this._isSend; }
  get isSubmitAndSend() { return this._isSubmitAndSend; }
  get isAccept() { return this._isAccept; }
  get isUnaccept() { return this._isUnaccept; }
  get isReturn() { return this._isReturn; }
  get isBack() { return this._isBack; }

  get createButton() { return this._createButton; }
  get editButton() { return this._editButton; }
  get deleteButton() { return this._deleteButton; }
  get sendButton() { return this._sendButton; }
  get submitAndSendButton() { return this._submitAndSendButton; }
  get acceptButton() { return this._acceptButton; }
  get unacceptButton() { return this._unacceptButton; }
  get returnButton() { return this._returnButton; }
  get backButton() { return this._backButton; }

  loading() {
    this._isLoading$.next(true);
  }

  unLoading() {
    this._isLoading$.next(false);
  }

  setEditMode(editMode: boolean) {
    this._editMode$.next(editMode);

    if (editMode) {
      this._createButton = null;
    } else {
      this._editButton = null;
    }
  }

  setWorkFlowInfo(info: WorkflowButtonGroupInfo) {
    this._workflowInfo$.next(info);
  }

  hideCreateActivity() {
    this._showCreateActivity$.next(null);
  }

  setShowCreateActivityVisibility(visibility: WorkflowActivitySendVisibility) {
    this._showCreateActivityVisibility$.next(visibility);
  }

  addButton(button: WorkflowButton): void {
    this._buttons$.next([...this._buttons$.getValue(), button]);
    this._buttons$.getValue().sort((a, b) => a.order > b.order ? 1 : -1);
  }

  addButtons(buttons: WorkflowButton[]): void {
    buttons.forEach(button => {
      this.addButton(button);
    });
  }

  removeButton(button: WorkflowButton) {
    let index = this._buttons$.getValue().indexOf(button);
    this._buttons$.getValue().splice(index, 1);
  }

  removeButtons(buttons: WorkflowButton[]): void {
    buttons.forEach(button => {
      this.removeButton(button);
    });
  }

  clearButtons(): void {
    this._buttons$.next([]);
  }

  addCreateButton(onClick: (srcElementEvent?: any) => void) {
    this._editMode$.next(false);
    this._createButton = {
      label: this.actionTranslate?.save,
      buttonType: WorkflowButtonType.create,
      onClick: onClick,
      disabled: this._createButtonDisabled,
      invisible: this.entityTypePermitions ? !this.entityTypePermitions?.find(x => x.actionName == 'Create')?.granted : false,
      cssClass: 'ui-button-success col-sm-2 ml-2',
      iconClass: 'pi pi-plus',
      order: 1
    } as WorkflowButton;

    this._isCreate = true;
    this.addButton(this._createButton);
  }

  addEditButton(onClick: (srcElementEvent?: any) => void) {
    this._editMode$.next(true);
    this._editButton = {
      label: this.actionTranslate?.edit,
      buttonType: WorkflowButtonType.edit,
      onClick: onClick,
      disabled: this._editButtonDisabled,
      invisible: this.entityTypePermitions ? !this.entityTypePermitions?.find(x => x.actionName == 'Update')?.granted : false,
      cssClass: 'ui-button-raised ui-button-success col-sm-2 ml-2',
      iconClass: 'pi pi-check',
      order: 2
    } as WorkflowButton;

    this._isEdit = true;
    this.addButton(this._editButton);
  }

  addDeleteButton(onClick: (srcElementEvent?: any) => void) {
    this._deleteButton = {
      label: this.actionTranslate?.delete,
      buttonType: WorkflowButtonType.delete,
      onClick: onClick,
      disabled: this._deleteButtonDisabled,
      invisible: this.entityTypePermitions ? !this.entityTypePermitions?.find(x => x.actionName == 'Delete')?.granted : false,
      cssClass: 'ui-button-danger col-sm-2 ml-2',
      iconClass: 'pi pi-trash',
      order: 3
    } as WorkflowButton;

    this._isDelete = true;
    this.addButton(this._deleteButton);
  }

  addSendButton(input: WorkflowSendButton) {
    this._sendButton = {
      label: this.actionTranslate?.send,
      buttonType: WorkflowButtonType.send,
      onClick: input.showCreateActivity ? (): void => { this.showCreateActivity(input); } : input.onClick,
      disabled: this._sendButtonDisabled,
      invisible: this.entityTypePermitions ? !this.entityTypePermitions?.find(x => x.actionName == 'Create')?.granted && !this.entityTypePermitions?.find(x => x.actionName == 'Update')?.granted : false,
      cssClass: 'ui-button-primary float-left col-sm-2 mr-2',
      iconClass: 'fa fa-paper-plane',
      order: 4
    } as WorkflowButton;

    this._isSend = true;
    this.addButton(this._sendButton);

    this._isShowCreateActivity$.next(input.showCreateActivity);
  }

  addSubmitAndSendButton(input: WorkflowSendButton) {
    var editMode = this._editMode$.getValue();
    this._submitAndSendButton = {
      label: `${editMode ? this.actionTranslate?.edit : this.actionTranslate?.save} ${this.actionTranslate?.and} ${this.actionTranslate?.send}`,
      buttonType: WorkflowButtonType.send,
      onClick: input.showCreateActivity ? (): void => { this.showCreateActivity(input); } : input.onClick,
      disabled: this._sendButtonDisabled,
      invisible: this.entityTypePermitions ? !this.entityTypePermitions?.find(x => x.actionName == 'Create')?.granted && !this.entityTypePermitions?.find(x => x.actionName == 'Update')?.granted : false,
      cssClass: 'ui-button-primary float-left col-sm-2 mr-2',
      iconClass: 'fa fa-paper-plane',
      order: 5
    } as WorkflowButton;

    this._isSubmitAndSend = true;
    this.addButton(this._submitAndSendButton);

    this._isShowCreateActivity$.next(input.showCreateActivity);
  }

  private showCreateActivity(input: WorkflowSendButton) {
    this._showCreateActivity$.next(input);
  }

  addAcceptButton(onClick: (srcElementEvent?: any) => void) {
    this._acceptButton = {
      label: this.actionTranslate?.accept,
      buttonType: WorkflowButtonType.accept,
      onClick: onClick,
      disabled: this._acceptButtonDisabled,
      invisible: this.entityTypePermitions ? !this.entityTypePermitions?.find(x => x.actionName == 'Check')?.granted : false,
      cssClass: 'ui-button-success float-left col-sm-2',
      iconClass: 'pi pi-check',
      order: 7
    } as WorkflowButton;

    this._isAccept = true;
    this.addButton(this._acceptButton);
  }

  addUnacceptButton(onClick: (srcElementEvent?: any) => void) {
    this._unacceptButton = {
      label: this.actionTranslate?.unaccept,
      buttonType: WorkflowButtonType.unAccept,
      onClick: onClick,
      disabled: this._unacceptButtonDisabled,
      invisible: this.entityTypePermitions ? !this.entityTypePermitions?.find(x => x.actionName == 'Check')?.granted : false,
      cssClass: 'ui-button-danger float-left col-sm-2 mr-2',
      iconClass: 'pi pi-times',
      order: 6
    } as WorkflowButton;

    this._isUnaccept = true;
    this.addButton(this._unacceptButton);
  }

  addReturnButton(onClick: (srcElementEvent?: any) => void) {
    this._returnButton = {
      label: this.actionTranslate?.return,
      buttonType: WorkflowButtonType.return,
      onClick: onClick,
      disabled: this._returnButtonDisabled,
      invisible: this.entityTypePermitions ? !this.entityTypePermitions?.find(x => x.actionName == 'Check')?.granted : false,
      cssClass: 'ui-button-primary float-left col-sm-2 mr-2',
      iconClass: 'pi pi-times',
      order: 8
    } as WorkflowButton;

    this._isReturn = true;
    this.addButton(this._returnButton);
  }

  addBackButton(onClick: (srcElementEvent?: any) => void) {
    this._backButton = {
      label: this.actionTranslate?.back,
      buttonType: WorkflowButtonType.back,
      onClick: onClick,
      invisible: false,
      cssClass: 'ui-button-secondary col-sm-2',
      order: 9
    } as WorkflowButton;

    this._isBack = true;
    this.addButton(this._backButton);
  }

  createButtonCheckFormInvalid(form: FormGroup) {
    if (this._createButton) this._createButton.disabled = form.invalid;

    form.valueChanges.subscribe(() => {
      if (this._createButton) this._createButton.disabled = form.invalid || this._createButtonDisabled;
    });
  }

  editButtonCheckFormInvalid(form: FormGroup) {
    if (this._editButton) this._editButton.disabled = form.invalid;

    form.valueChanges.subscribe(() => {
      if (this._editButton) this._editButton.disabled = form.invalid || this._editButtonDisabled;
    });
  }

  deleteButtonCheckFormInvalid(form: FormGroup) {
    if (this._deleteButton) this.deleteButton.disabled = form.invalid;

    form.valueChanges.subscribe(() => {
      if (this._deleteButton) this.deleteButton.disabled = form.invalid || this._deleteButtonDisabled;
    });
  }

  submitAndSendButtonCheckFormInvalid(form: FormGroup) {
    if (this._submitAndSendButton) this.submitAndSendButton.disabled = form.invalid;

    form.valueChanges.subscribe(() => {
      if (this._submitAndSendButton) this.submitAndSendButton.disabled = form.invalid || this._sendButtonDisabled;
    });
  }

  acceptButtonCheckFormInvalid(form: FormGroup) {
    if (this._acceptButton) this.acceptButton.disabled = form.invalid;

    form.valueChanges.subscribe(() => {
      if (this._acceptButton) this.acceptButton.disabled = form.invalid || this._acceptButtonDisabled;
    });
  }

  unacceptButtonCheckFormInvalid(form: FormGroup) {
    if (this._unacceptButton) this.unacceptButton.disabled = form.invalid;

    form.valueChanges.subscribe(() => {
      if (this._acceptButton) this.unacceptButton.disabled = form.invalid || this._unacceptButtonDisabled;
    });
  }

  returnButtonCheckFormInvalid(form: FormGroup) {
    if (this._returnButton) this.returnButton.disabled = form.invalid;

    form.valueChanges.subscribe(() => {
      if (this._returnButton) this.returnButton.disabled = form.invalid || this._returnButtonDisabled;
    });
  }

  checkPolicy(entityType: EntityType) {
    if (!entityType) {
      console.error('Entity name not set on geting policies.');
      return;
    }

    this.policyService.getEntityTypePermissions({ entityId: 0, entityTypeId: entityType }).subscribe(permitions => {
      this.entityTypePermitions = permitions;
      this.setButtonPolicies(this.entityTypePermitions);
    }, error => {
      console.error(error);
    });
  }

  private setButtonPolicies(permitions: EntityTypePermition[]) {
    if (this._createButton) this._createButton.invisible = !permitions.find(x => x.actionName == 'Create')?.granted;
    if (this._editButton) this._editButton.invisible = !permitions.find(x => x.actionName == 'Update')?.granted;
    if (this._deleteButton) this._deleteButton.invisible = !permitions.find(x => x.actionName == 'Delete')?.granted;
    if (this._submitAndSendButton) this._submitAndSendButton.invisible = !permitions.find(x => x.actionName == 'Create')?.granted && !permitions.find(x => x.actionName == 'Update')?.granted;
    if (this._acceptButton) this._acceptButton.invisible = !permitions.find(x => x.actionName == 'Check')?.granted;
    if (this._unacceptButton) this._unacceptButton.invisible = !permitions.find(x => x.actionName == 'Check')?.granted;
    if (this._returnButton) this._returnButton.invisible = !permitions.find(x => x.actionName == 'Check')?.granted;
  }

  setCreateButtonDisabled(action: boolean) {
    this._createButtonDisabled = action;
  }

  setEditButtonDisabled(action: boolean) {
    this._editButtonDisabled = action;
  }

  setDeleteButtonDisabled(action: boolean) {
    this._deleteButtonDisabled = action;
  }

  setSendButtonDisabled(action: boolean) {
    this._sendButtonDisabled = action;
  }

  setAcceptButtonDisabled(action: boolean) {
    this._acceptButtonDisabled = !action;
  }

  setUnacceptButtonDisabled(action: boolean) {
    this._unacceptButtonDisabled = !action;
  }

  setReturnButtonDisabled(action: boolean) {
    this._returnButtonDisabled = !action;
  }

}
