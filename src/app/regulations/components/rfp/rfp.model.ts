import {AppFile} from 'src/app/app-file-manager/app-file.model';

export interface Attachment {
  id: number;
  title: string;
  dataContentType: string;
  description: string;
  data: any;
  fileName: string;
  extension: string;
  fileSize: number;
  appFile?: AppFile;
  file?: any;
}

export interface RFP {
  id: number;
  certificateId: number;
  preamble: string;
  mainObjective: string;
  mainQuestion: string;
  secondaryObjectives: string;
  secondaryQuestions: string;
  mission: string;
  commands: string;
  domain: string;
  dependencies: string;
  resources: string;
  opportunities: string;
  considerations: string;
  regulationExecutor: string;
  stakeholdersInternal: string;
  stakeholdersExternal: string;
  attachments: Attachment[];

}

export interface ExpertPersonStatusInput {
  id: number;
  status: boolean;
}

export interface ExpertPersonInput {
  status: boolean | null;
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
  internal,
  external
}

// tslint:disable-next-line:class-name
export class certificate {
  id: number;
  title: string;
}
