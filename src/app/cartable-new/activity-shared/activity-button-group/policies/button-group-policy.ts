import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/user-management/models/user';
import { UserService } from 'src/app/user/user.service';
import { AppSharedModule } from '../../../../app-shared/app-shared.module';
import { FormContainerChildBaseComponent } from '../../../../form-container/models/form-container-child-base-component';
import { PolicySetService } from '../../../../policy/services/policy-set.service';
import { WorkflowButton } from '../../../../workflow/workflow-shared/workflow-button-group/models/workflow-button';

export class ButtonGroupPolicy extends FormContainerChildBaseComponent {

  public translate: TranslateService;
  public policyService: PolicySetService;
  public userService: UserService;
  actionTranslate: any;
  currUser: User;

  constructor() {
    super();
    this.translate = AppSharedModule.injector.get(TranslateService);
    this.policyService = AppSharedModule.injector.get(PolicySetService);
    this.userService = AppSharedModule.injector.get(UserService);
  }

  setButtons(buttons: WorkflowButton[], entityName: string, mode: string) {
    this.userService.getCurrentUser().subscribe(res => {
      this.currUser = res;
      if (this.currUser.policySets.find(x => x.id === 1)) {
        if (mode === 'add') {
          buttons.forEach(x => {
            if (x.buttonType === 'edit') {
              x.invisible = true;
            }
          });
        } else {
          buttons.forEach(x => {
            if (x.buttonType === 'create') {
              x.invisible = true;
            }
            if (x.buttonType === 'edit') {
              x.invisible = false;
            }
            if (x.buttonType === 'send') {
              x.invisible = false;
            }
          });
        }
      } else {
        this.policyService.getPolicyCategoriesByEntity(entityName).subscribe(policies => {
          if (policies.Create || policies.Update) {
            if (mode === 'add') {
              buttons.forEach(x => {
                if (x.buttonType === 'edit') {
                  x.invisible = true;
                }
              });
            } else {
              buttons.forEach(x => {
                if (x.buttonType === 'create') {
                  x.invisible = true;
                }
                if (x.buttonType === 'edit') {
                  x.invisible = false;
                }
                if (x.buttonType === 'send') {
                  x.invisible = false;
                }
              });
            }
          }
          if (policies.Delete) {
            buttons.forEach(x => {
              if (x.buttonType === 'delete') {
                x.invisible = false;
              }
            });
          }
          if (policies.Check) {
            buttons.forEach(x => {
              if (x.buttonType === 'accept') {
                x.invisible = false;
              }
              if (x.buttonType === 'unAccept') {
                x.invisible = false;
              }
            });
          }
        });
      }
    }, error => {
      buttons = null;
    });
  }

}
