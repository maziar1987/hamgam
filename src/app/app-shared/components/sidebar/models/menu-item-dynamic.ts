export interface MenuItemDynamic {
    id: number;
    label: string;
    type: string;
    order: number;
    min: number;
    max: number;
    formName: string;
    routerLink: string;
    icon: string;
    parentId: number;
}
