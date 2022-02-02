export interface AppFile {
  id: number;
  dataContentType: string;
  fileName: string;
  length: number;
  physicalFileName: string;
  extension: string;
  data: any;
}

export interface AppFileOutput {
  appFile: AppFile;
  data: any;
}

export class AppFileCustom {
  id: number;
  dataContentType: string;
  fileName: string;
  length: number;
  physicalFileName: string;
  extension: string;
  data: any;

  constructor(id: number, dataContentType: string, fileName: string, length: number, physicalFileName: string, extension: string, data: any) {
    this.id = id;
    this.dataContentType = dataContentType;
    this.fileName = fileName;
    this.length = length;
    this.physicalFileName = physicalFileName;
    this.extension = extension;
    this.data = data;
  }
}
