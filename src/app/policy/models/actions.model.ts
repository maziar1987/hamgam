import {ActionAttributesModel} from './action-attributes.model';
import {RuleModel} from './rule.model';
import {FieldsModel} from './fields.model';

export class ActionsModel {
  id: number;
  name: string;
  persianName: string;
  attributes: ActionAttributesModel;
  fields: FieldsModel[] = [];
  query: any;
}
