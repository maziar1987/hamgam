import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../../account/account.service';
import { OrgUnitService } from '../../basicinfo/org-unit/services/org-unit.service';
import { User } from '../../user-management/models/user';
import { UserService } from '../../user/user.service';
import { AppSharedModule } from '../app-shared.module';
import { ToastService } from './../services/toast.service';
import { NotifyMessage } from './notify-message';

export abstract class BaseComponent {
  public form: FormGroup;

  protected translate: TranslateService;
  protected toast: ToastService;
  protected userService: UserService;
  public currentUser: User;
  protected accountService: AccountService;
  protected orgUnitService: OrgUnitService;

  constructor() {
    this.form = {} as FormGroup;
    this.translate = AppSharedModule.injector.get(TranslateService);
    this.toast = AppSharedModule.injector.get(ToastService);
    this.userService = AppSharedModule.injector.get(UserService);
    this.accountService = AppSharedModule.injector.get(AccountService);
    this.orgUnitService = AppSharedModule.injector.get(OrgUnitService);
    this.accountService.currentAccount$.subscribe(user => {
      this.currentUser = user;
    });
  }

  errorNotify(message: NotifyMessage = { detail: 'عملیات ناموفق بود', summary: 'رخداد خطا' }) {
    this.toast.error(message.detail, message.summary);
  }
  warningNotify(message: NotifyMessage = { detail: 'خطا در هنگام انجام عملیات', summary: 'اخطار !' }) {
    this.toast.warn(message.detail, message.summary);
  }
  successNotify(message: NotifyMessage = { detail: 'عملیات با موفقیت انجام شد', summary: 'عملیات موفق' }) {
    this.toast.success(message.detail, message.summary);
  }
  infoNotify(message: NotifyMessage = { detail: 'لطفا دقت نمایید', summary: 'توجه' }) {
    this.toast.info(message.detail, message.summary);
  }

  getFormControl(name: string) {
    return this.form.get(name);
  }
  getFormControlValue(name: string) {
    const e = this.form.get(name);
    return e ? e.value : null;
  }

  isValid(name: string) {
    const e = this.form.get(name);
    return e && e.valid;
  }
  isInvalid(name: string) {
    const e = this.getFormControl(name);
    return e && (e.dirty || e.touched) && e.invalid;
  }
  isChanged(name: string) {
    const e = this.form.get(name);
    return e && (e.dirty || e.touched);
  }
  hasError(name: string) {
    const e = this.form.get(name);
    return e && e.invalid && (e.dirty || e.touched);
  }
}
