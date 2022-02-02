import { EntityType } from './entity-type';
import { FormType } from './form-type.enum';
import { MenuType } from './menu-type.enum';
import { ViewType } from './view-type.enum';

export interface Menu {
    id: number;
    label: string;
    type: string;
    order: number;
    formName: string;
    routerLink: string;
    icon: string;
    parentId: number;
    relatedEntity: EntityType;
    formType: FormType;
    menuType: MenuType;
    viewType: ViewType;
}
