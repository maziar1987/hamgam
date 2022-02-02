import { FormGroup } from '@angular/forms';
import { DynamicFormControl } from '../models/dynamic-form-control.model';

export class FormContainerChild {
    formGroup: FormGroup;
    component: any;
    componentSelector: string;
    childType: ChildType;
    entityType: EntityType;
    serviceUrl?: string;
    formGroupData?: FormGroupData[];
    dynamicFormControls: DynamicFormControl[];
    // customValidator?: ValidatorFn[];       
    appendObjectName?: string;
    unEditable?: boolean;
    isProcessStarter?: boolean;
    isProcessCompleter?: boolean;

    constructor(options: {
        formGroup: FormGroup;
        component: any;
        componentSelector: string;
        childType: ChildType;
        entityType: EntityType;
        serviceUrl?: string;
        formGroupData?: FormGroupData[];
        dynamicFormControls?: DynamicFormControl[];
        // customValidator?: ValidatorFn[];
        confirmationMode?: boolean;
        uneditable?: boolean;
        unsentable?: boolean;
        appendObjectName?: string;
        unEditable?: boolean;
        isProcessStarter?: boolean;
        isProcessCompleter?: boolean;
    }) {
        this.formGroup = options.formGroup;
        this.component = options.component;
        this.componentSelector = options.componentSelector;
        this.childType = options.childType;
        this.entityType = options.entityType;
        this.serviceUrl = options.serviceUrl;
        this.dynamicFormControls = options.dynamicFormControls;
        this.formGroupData = options.formGroupData;
        // this.customValidator = options.customValidator;      
        this.appendObjectName = options.appendObjectName;
        this.unEditable = this.unEditable;
        this.isProcessStarter = options.isProcessStarter;
        this.isProcessCompleter = options.isProcessCompleter;
    }
}

export interface FormGroupData {
    name: string;
    file: File;
}

export enum ChildType {
    list,
    create,
    edit,
    detail
}

export enum EntityType {
    Employee,
    Document,
    ExpertPerson,
    ExpertWorkingGroup
}

export interface FormContainerChildInput {
    formValue?: string;
    entityType: EntityType;
    componentSelector: string;
}