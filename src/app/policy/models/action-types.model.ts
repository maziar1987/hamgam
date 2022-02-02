import {FieldsModel} from './fields.model';

export class ActionTypesModel {
  id: number;
  name: string;
  method: string;
  path: string;
  className: string;
  fields: FieldsModel[] = [];
}

