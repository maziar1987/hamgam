import { AppSharedModule } from 'src/app/app-shared/app-shared.module';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { FormContainerService } from '../services/form-container.service';

export class FormContainerChildBaseComponent extends BaseComponent {

    public formContainerService: FormContainerService;

    constructor() {
        super();

        this.formContainerService = AppSharedModule.injector.get(FormContainerService);
    }

    cssClass(controlName: string): string {
        var dc = this.formContainerService.currentChild?.dynamicFormControls?.find(x => x.key === controlName)
        if (dc === undefined || dc?.cssClass === null) {
            return '';
        }

        return dc?.cssClass;
    }

    placeholder(controlName: string): string {
        var dc = this.formContainerService.currentChild?.dynamicFormControls?.find(x => x.key === controlName)
        if (dc === undefined || dc?.placeholder === null) {
            return '';
        }

        return dc?.placeholder;
    }

    visible(controlName: string): boolean {
        var dc = this.formContainerService.currentChild?.dynamicFormControls?.find(x => x.key === controlName)
        if (dc === undefined || dc?.visible === null)
            return true;

        return dc?.visible;
    }

    disabled(controlName: string): boolean {
        var dc = this.formContainerService.currentChild?.dynamicFormControls?.find(x => x.key === controlName)
        if (dc === undefined || dc?.disabled === null)
            return false;

        return dc?.disabled;
    }

    readonly(controlName: string): boolean {
        var dc = this.formContainerService.currentChild?.dynamicFormControls?.find(x => x.key === controlName)
        if (dc === undefined || dc?.readonly === null)
            return false;

        return dc?.readonly;
    }

    label(controlName: string): string {
        var dc = this.formContainerService.currentChild?.dynamicFormControls?.find(x => x.key === controlName)
        if (dc === undefined || dc?.label === null) {
            return '';
        }

        return dc?.label;
    }

    showClear(controlName: string): boolean {
        var dc = this.formContainerService.currentChild?.dynamicFormControls?.find(x => x.key === controlName)
        if (dc === undefined || dc?.placeholder === null) {
            return false;
        }

        return dc?.placeholder !== '';
    }

}