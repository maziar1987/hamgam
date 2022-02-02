import {ElementModel} from './element.model';
import {ActionsModel} from './actions.model';

export class ElementPolicyModel {
  id: string;
  elementId: string;
  element: ElementModel;
  policySetId: string;
  type: string;
  actions: ActionsModel[] = [];
}
