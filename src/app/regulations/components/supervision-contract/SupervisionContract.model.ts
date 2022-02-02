import { AppFile } from "src/app/app-file-manager/app-file.model";

export class SupervisionContract {
    certificateId: number;
    id: number;
    contractDate: Date;
    contractDuration: number;
    contractNo: string;
    contractAmountSupervisor: number;    
    description:string;
    attachment: AppFile;
    attachmentId:number;    
  }