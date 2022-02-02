import { RuleModel } from './rule.model';

export class ActionAttributesModel {
  id: number;
  active: false;
  rules: RuleModel[] = [];
  query: RuleModel = new RuleModel(); // this is Unused Model Please Delete it!!!!!!
}

