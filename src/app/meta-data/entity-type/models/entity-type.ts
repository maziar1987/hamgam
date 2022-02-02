import { Action } from './action';
import { Field } from './field';
import { Menu } from './menu';
export interface EntityType {
    id: number;
    name: string;
    persianName: string;
    fields: Field[];
    actions: Action[];
    menu: Menu;
}
