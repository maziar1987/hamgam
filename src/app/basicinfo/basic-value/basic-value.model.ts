
export interface BasicValue {
    id: number;
    title: string;
    code: string;
    status: basicValueStatusEnum;
    readonly: boolean;
    viewOrder: number;
    sortType: basicValueSortTypeEnum;
    parentId: number | null;
    defaultValue: BasicValue;
    defaultValueId?: number;
    children?: BasicValue[];
}
export enum basicValueStatusEnum {
    ACTIVE, INACTIVE, DELETED
}
export enum basicValueSortTypeEnum {
    NONE, ALPHABET, VIEWORDER, CODE
}
export interface BasicValueSearch {
    data: BasicValue[];
    totalCount: number;
}
export interface BasicValueCreate {

    title: string;
    code: string;
    status: string;
    readonly: boolean;
    viewOrder: number;
    sortType: string;
    parentId: number | null;
}

export interface BasicValueUpdate {
    id: number;

    title: string;
    code: string;
    status: string;
    readonly: boolean;
    viewOrder: number;
    sortType: string;
    parentId: number | null;
    defaultValueId?: number;
}

export interface BasicValueInput {
    parentId: number | null;
    code?: string;
}

export enum BasicValueType {
    // طبقه بندی
    classification = 37,
    // اولویت
    priority = 38,
    // متن پیش فرض
    defaultText = 39,
    /// مدرک تحصیلی
    educationDegree = 63,
    /// رشته تحصیلی
    studyField = 88,
    /// درجه / رتبه
    rank = 76,
    // مسئولیت
    responsibility = 41,
    regulationType = 42,
    confidentiality = 44,
    compilationStatusId = 45,
    confirmer = 50,
    regulationStatus = 48,
    revisionLevel = 51,
    revisionCause = 52,
    cause = 49,
    applicationLevel = 46,
    applicationArea = 47,
    responsibilityTeam = 53,
    //نوع جلسه هیئت خبرگی
    najaExpertsSessionType = 89,
    confirmationStatusTeam = 90,
    // confirmationStatusProposal = 91,
    // confirmationStatusRfp = 92,
    confirmationStatusTeamBaseTheory = 98,
    confirmationStatusProposalBaseTheory = 96,
    confirmationStatusRfpBaseTheory = 97,
    statusRequired = 1157,
    statusReview = 1159,
    statusAvailable = 1158,
    expertResponsibility = 1141,
    personApprovementBoss = 1139,
    personApprovementDeputy = 1140,
    personApprovementMember = 1141,
    najaExpertSessionTypeSelected = 394607,
    confirmRFP = 624205,
    confirmTeam = 624207,
    confirmProposal = 624203,
    activityTypes = 11228
}

export enum ClassificationType {
    normal = 101,
    secret = 102,
    topSecret = 103,
    superSecret = 104
}

export enum DefaultTextValue {
    Action = 301,
    BeObserved = 302
}

export enum PriorityType {
    Normal = 201,
    Instantaneous = 202,
    Immediate = 203
}

export class BasicValueConsts {
    static readonly ValueMaxLength = 512;
}

export enum Responsibility {
    CHAIRMAN = 901,
    SECRETARY = 902,
    MEMBER = 903
}

export interface BasicValueMovementInput {
    parentId: number;
    childsId: number[];
}

export class BasicValueInputContract implements BasicValueInput {
    code: string;
    parentId: number | null;
    constructor(code: string, parentId: number) {
        this.code = code;
        this.parentId = parentId;
    }
}
