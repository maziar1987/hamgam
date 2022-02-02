import { AppFile } from "src/app/app-file-manager/app-file.model";

export interface CompilationContractPayment {
    contractAmountExecutor: number;
    contractAmountMaster: number;
    masterSupervisorId: number;
    masterSupervisorFullName: string;
    executorId: number;
    executorFullName: string;
    certificateId: number;
    certificateTitle: string;
    paymentMethodId: number;

    supervisorFullName: string;
    supervisorId: number;
    contractAmountSupervisor: number;
}
export interface PaymentTable {
    id: number;
    certificateId: number;
    stepNumber: number;
    stepPercent: number;
    fullName: string;
    teamMemberId: number;
    responsibilityName: string;
    amount: number;
    paymentDate: Date;
    description: string;
    fileId: number;
    paymentMethodId: number;
}
export interface PaymentDTO {
    id: number;
    certificateId: number;
    paymentAmount: number;
    paymentDate: Date;
    teamMemberId: number;
    description: string;
    file: AppFile;
    fileId: number;
    paymentMethodId: number;
    paymentPercent: number;
    paymentStep: number;
}