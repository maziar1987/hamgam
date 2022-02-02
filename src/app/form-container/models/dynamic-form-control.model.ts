
export class DynamicFormControl<TValue = any> {
    value: TValue;
    key: string;
    label: string;
    required: boolean;
    requiredTrue: boolean;
    minLength: number;
    maxLength: number;
    min: number;
    max: number;
    pattern: string | RegExp;
    nullValidator: boolean;
    email: boolean;
    customValidators: string[];
    order: number;
    controlType: string;
    type: string;
    options: { key: string, value: string }[];
    cssClass: string;
    placeholder: string;
    visible: boolean | null;
    disabled: boolean | null;
    readonly: boolean | null;

    constructor(options: {
        value?: TValue;
        key?: string;
        label?: string;
        required?: boolean;
        requiredTrue?: boolean;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        pattern?: string | RegExp;
        nullValidator?: boolean;
        email?: boolean;
        customValidators?: string[];
        order?: number;
        controlType?: string;
        type?: string;
        options?: { key: string, value: string }[];
        cssClass?: string;
        placeholder?: string;
        visible?: boolean | null;
        disabled?: boolean | null;
        readonly?: boolean | null;
    } = {}) {
        this.value = options.value;
        this.key = options.key || '';
        this.label = options.label || '';
        this.required = !!options.required;
        this.requiredTrue = options.requiredTrue;
        this.minLength = options.minLength;
        this.maxLength = options.maxLength;
        this.min = options.min;
        this.max = options.max;
        this.pattern = options.pattern;
        this.nullValidator = options.nullValidator;
        this.email = options.email;
        this.customValidators = options.customValidators;
        this.order = options.order === undefined ? 1 : options.order;
        this.controlType = options.controlType || '';
        this.type = options.type || '';
        this.options = options.options || [];
        this.cssClass = options.cssClass;
        this.placeholder = options.placeholder;
        this.visible = options.visible;
        this.disabled = options.disabled;
        this.readonly = options.readonly;
    }
}

export class TextboxFormControl extends DynamicFormControl<string> {
    controlType = 'textbox';
}

export class DropdownFormControl extends DynamicFormControl<string> {
    controlType = 'dropdown';
}