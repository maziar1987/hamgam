export class ContainerButton<DataType = any> {
    label: string;
    tooltip?: string;
    tooltipLocalization?: string;
    cssClass?: string;
    iconClass?: string;
    order?: number;
    onClick?: (event?: any) => void;
    data?: DataType;
    disabled?: boolean;
    unvisible?: boolean;
}