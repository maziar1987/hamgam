import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from 'src/app/app-shared/base/base.service';
import { DynamicFormControl } from '../models/dynamic-form-control.model';
import { ChildType, FormContainerChild, FormContainerChildInput } from '../models/form-container.model';


@Injectable({
    providedIn: 'root'
})
export class FormContainerService extends BaseService {

    private _currentChild: FormContainerChild;
    private _loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        super();
    }

    get loading$() { return this._loading$.asObservable(); }

    get currentChild(): FormContainerChild { return this._currentChild; }
    set currentChild(currentChild: FormContainerChild) {

        this._currentChild = currentChild;
        if (this._currentChild &&
            (this._currentChild.childType === ChildType.create || this._currentChild.childType === ChildType.edit)) {
            this._loading$.next(true);
            this.setCurrentChildFormControls(this._currentChild);
        }
    }

    private setCurrentChildFormControls(currentChild: FormContainerChild) {

        var input = <FormContainerChild>{
            entityType: currentChild.entityType,
            componentSelector: currentChild.componentSelector
        };

        this.getFormContainerChildFormControls(input).subscribe(res => {

            currentChild.dynamicFormControls = res;

            if (!currentChild.dynamicFormControls) {
                return;
            }

            currentChild.dynamicFormControls.forEach(dynamicControl => {
                var formGroupControl = currentChild.formGroup.controls[dynamicControl.key];
                if (formGroupControl === undefined) {
                    return;
                }

                if (dynamicControl.value) {
                    formGroupControl.setValue(dynamicControl.controlType == 'dropdown' ? +dynamicControl.value : dynamicControl.value);
                }

                if (dynamicControl.disabled) {
                    formGroupControl.disable();
                }
                else {
                    formGroupControl.enable();
                }

                var validators = this.getValidators(dynamicControl, currentChild);
                if (validators.length > 0) {
                    if (formGroupControl.validator) {
                        formGroupControl.setValidators([...validators, formGroupControl.validator]);
                    } else {
                        formGroupControl.setValidators(validators);
                    }

                    formGroupControl.updateValueAndValidity();
                }
            });
        }, error => {
            this._loading$.next(false);
            console.error('setCurrentChildFormControls error: ', error);
        }, () => {
            this._loading$.next(false);
        });

    }

    private getValidators(control: DynamicFormControl, currentChild: FormContainerChild): ValidatorFn[] {

        var validators: ValidatorFn[] = [];

        if (control.required) validators.push(Validators.required);
        if (control.requiredTrue) validators.push(Validators.requiredTrue);
        if (control.minLength) validators.push(Validators.minLength(control.minLength));
        if (control.maxLength) validators.push(Validators.maxLength(control.maxLength));
        if (control.min) validators.push(Validators.min(control.min));
        if (control.max) validators.push(Validators.max(control.max));
        if (control.pattern) validators.push(Validators.pattern(control.pattern));
        if (control.nullValidator) validators.push(Validators.nullValidator);
        if (control.email) validators.push(Validators.email);
        if (control.customValidators?.length > 0) {
            control.customValidators.forEach(customValidator => {
                if (typeof currentChild.component[customValidator] == 'function')
                    validators.push(currentChild.component[customValidator]);
            });

        }

        // currentChild.customValidator.forEach(customValidator => {
        //     validators.push(customValidator);
        // });

        return validators;
    }

    private getChildFormValue(input: FormContainerChild) {
        return input.serviceUrl ? input.formGroup.value : <FormContainerChildInput>{ formValue: JSON.stringify(input.formGroup.value), entityType: input.entityType };
    }

    private getChildFormUrl(input: FormContainerChild): string {
        return `${this.apiUrl}${input.serviceUrl ? input.serviceUrl : '/services/nrmsdomain/api/form-container'}`;
    }

    getFormContainerChildFormControls(input: FormContainerChildInput): Observable<DynamicFormControl[]> {
        var url = this.apiUrl + "/services/nrmsdomain/api/form-container";
        return this.http.post<DynamicFormControl[]>(url, input);//.pipe(delay(3000));
    }

    post(input: FormContainerChild): Observable<any> {

        var url = this.getChildFormUrl(input);
        var childFormValue = this.getChildFormValue(input);
        console.log(childFormValue);
        var formData: FormData = new FormData();
        input.formGroupData?.forEach(data => {
            formData.append(data.name, data.file, data.file.name);
        });
        formData.append(input.appendObjectName ? input.appendObjectName : "childObject", new Blob([JSON.stringify(childFormValue)], { type: 'application/json' }))

        return this.http.post<any>(url, formData);
    }

    put(input: FormContainerChild): Observable<any> {

        var url = this.getChildFormUrl(input);
        var childFormValue = this.getChildFormValue(input);
        console.log(childFormValue);
        var formData: FormData = new FormData();
        input.formGroupData?.forEach(data => {
            formData.append(data.name, data.file, data.file.name);
        });
        formData.append(input.appendObjectName ? input.appendObjectName : "childObject", new Blob([JSON.stringify(childFormValue)], { type: 'application/json' }))

        return this.http.put<any>(url, formData);
    }

    delete(input: FormContainerChild): Observable<Object> {
        var url = this.getChildFormUrl(input);
        url = `${url}/${input.formGroup.controls.id.value}`;
        return this.http.delete(url);
    }

}