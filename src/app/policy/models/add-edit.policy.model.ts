import {ActionAttributesModel} from './action-attributes.model';

export class AddEditPolicyModel {
  id: number;
  name: string;
  actionTypes: ActionAttributesModel[];
}
