export class PaymentMethod {
    id: number;
    methodName:string;
    steps:number[];
    stepsNumber:number;
    description:string;
    status:boolean;
    lastEditDate:Date;
    hasPayment:boolean;
}