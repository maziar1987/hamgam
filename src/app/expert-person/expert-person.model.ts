import { AppFile } from 'src/app/app-file-manager/app-file.model';
import { BasicValue } from '../basicinfo/basic-value/basic-value.model';

export interface ExpertPerson {
    id: number;
    categoryId: number;
    personId: number;
    personnelCode: string;
    personType: PersonType;
    nationalCode: string;
    firstName: string;
    lastName: string;
    fatherName: string;
    birthDate: Date;
    educationDegreeId: number;
    studyFieldId: number;
    relation: RelationType;
    serviceStatus: ServiceStatus;
    serviceLocationId: number;
    degreeId: number;
    employmentDate: Date;
    currentResponsibility: string;
    threePreviousPosition: string;
    scientificExperiencesRecords: string;
    accountNumber: string;
    shabaNumber: string;
    personImageId: number;
    personImage: AppFile;
    educationImageId: number;
    educationImage: AppFile;
    attachmentId: number;
    attachment: AppFile;
    description: string;
    inactive: boolean;
    status: BasicValue | null;
    // statusCode: string;
    creatorId: number;
    lastEditTime: Date;
}

export interface ExpertPersonStatusInput {
    id: number;
    status: boolean;
}

export interface ExpertPersonInput {
    statusCode: string | null;
}

/// <summary>
/// وابستگی
/// </summary>
export enum RelationType {
    /// <summary>
    /// نظامی
    /// </summary>
    military,

    /// <summary>
    /// غیرنظامی
    /// </summary>
    civilian
}

/// <summary>
/// وضعیت خدمت
/// </summary>
export enum ServiceStatus {
    /// <summary>
    /// شاغل
    /// </summary>
    employed,

    /// <summary>
    /// بازنشسته
    /// </summary>
    retired
}

export enum PersonType {
    INTERNAL,
    EXTERNAL
}
