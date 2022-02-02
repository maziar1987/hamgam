import { TreeNode } from 'primeng';
import { ActionsModel } from './actions.model';

export class ElementModel {
  id: string;
  name: string;
  persianName: string;
  type: string;
  actions: ActionsModel[] = [];
  children: TreeNode[] = [];
}




