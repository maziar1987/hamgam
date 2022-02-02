import { AppFile } from "src/app/app-file-manager/app-file.model";

export interface Attachment {
    id?: number;
    name: string;
    objectType: string;
    objectId?: number;
    activityId?: number;
    appFile?:AppFile;
    file?: any;
}
