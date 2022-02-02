export interface StartProcessInstanceBody {
  variables: StartProcessInstanceBodyVariables;
  businessKey: string;
}

export interface StartProcessInstanceBodyVariables {
  action?: Variable;
  approved?: Variable;
  unitId: Variable;
  formName: Variable;
  userId: Variable;
  taskId?: Variable;
}

export interface Variable {
  value: any;
  type: string;
}

export enum ExpertPersonVariableValue {
  return,
  reject,
  approve
}

// {
//   "variables": {
//     "approved" :{
//         "value" :true,
//         "type": "Boolean"
//     },
//     "unitId" :{
//         "value" :"81568",
//         "type": "String"
//     },
//     "formName" :{
//         "value" :"frmRegisterPerson",
//         "type": "String"
//     },
//     "userId" :{
//         "value" :"123",
//         "type": "String"
//     }
//   },
//  "businessKey" : "4-1113"
// }
