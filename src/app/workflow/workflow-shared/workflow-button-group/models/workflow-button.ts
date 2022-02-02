import { WorkflowButtonType } from "./workflow-button-type.enum";

export class WorkflowButton<DataType = any> {
    label: string;
    buttonType: WorkflowButtonType;
    onClick: (srcElementEvent?: any) => void;
    cssClass?: string;
    iconClass?: string;
    order?: number;
    data?: DataType;
    disabled?: boolean;
    invisible?: boolean;
}
