import { ElementModel } from './element.model';

export class PolicySet {
  id: number;
  name: string;
  active: boolean;
  lastEditor: string;
  lastEditDate: string;
  description: string;
  categories: ElementModel[] = [];
  usersIds: number[];
  menusIds: number[];
  positionsIds: number[];
  orgUnitsIds: number[];
  deletable: boolean;
}

export class PolicyButtonGroup {
  objectId: number;
  objectType: string;
  policyCategoryName: string;
}

