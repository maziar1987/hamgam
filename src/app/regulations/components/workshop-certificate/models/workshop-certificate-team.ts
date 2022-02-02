import { AppFile } from "src/app/app-file-manager/app-file.model";

export interface WorkshopTeam {
    id: number;    
    teamMemberId: number;
    teamFullName: string;
    responsibilityId: number;
    responsibilityName: string;
    isActive: boolean;
    hasCertificate: boolean;
    description: string;
    certificateNO: string;
    accomplishmentDate: Date;
    expireDate: Date;
    fileId: number;
}

export interface WorkshopCertificate {
    id: number;
    certificateId: number;
    certificateNO: string;
    accomplishmentDate: Date;
    expireDate: Date;
    teamMemberId: number;
    hasCertificate: boolean;
    description: string;
    file: AppFile;
    fileId:number;   
}