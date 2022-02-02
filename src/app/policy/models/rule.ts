import { FieldsModel } from "./fields.model";

export interface Rule {
  field: FieldsModel;
  condition: string;
  valuesList?: string[];
  attributesId: number;
}
