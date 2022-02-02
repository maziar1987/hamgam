import { BasicValue } from "src/app/basicinfo/basic-value/basic-value.model";
import { Condition } from "./Conditions";
import { FieldsModel } from "./fields.model";

export class RuleModel {
  id: number;
  valuesList: string[] = [];
  valuesListItem: BasicValue[] = [];
  conditionModel: Condition;
  fieldId: number;
  field: FieldsModel;
  attributesId: number;
  condition: string
  // operator: string;
  // actionId: string;
  // field: any;

  // rules: RuleModel[] = [];

}
