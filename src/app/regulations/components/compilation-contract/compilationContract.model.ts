import { AppFile } from "src/app/app-file-manager/app-file.model";

export class CompilationContract {
  certificateId: number;
  id: number;
  contractDate: Date;
  contractDuration: number;
  contractNo: string;
  contractAmountExecutor: number;
  contractAmountMaster: number;
  description: string;
  attachment: AppFile;
  attachmentId: number;
  paymentMethodId: number;
  hasPayment:boolean;
}