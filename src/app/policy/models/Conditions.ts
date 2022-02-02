
export class Condition {
    label: string;
    value: string;
}
export class stringCondition {
    stringConditions: Condition[] = [];
    constructor() {
        this.stringConditions = [
            { label: '=', value: '=' },
            { label: '!=', value: '!=' }
        ];
    }
}



export class numberCondition {
    numberConditions: Condition[] = [];
    constructor() {
        this.numberConditions = [
            { label: '=', value: '=' },
            { label: '!=', value: '!=' },
            { label: '>', value: '>' },
            { label: '<', value: '<' },
            { label: '>=', value: '>=' },
            { label: '<=', value: '<=' },
        ];
    }
}