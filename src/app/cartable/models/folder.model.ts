export interface Folder {
    id: number;
    ownerId: number
    folderName: string;
    parentId?: number;    
}

export interface ActivityMove {
    ownerId: number
    activitiesIds: number[]
    fromFolderId: number
    toFolderId: number
}

export interface ActivityTrash {
    ownerId: number
    activitiesIds: number[]
    fromFolderId: number
}

export interface ActivityArchive {
    ownerId: number
    activitiesIds: number[]
    fromFolderId: number
}

export interface ActivityRestore {
    ownerId: number
    activitiesIds: number[]
    fromFolderId: number
}

export interface FolderNew {
    id?: number;
    folderName: string;
    parentId: number;
}

export interface FolderRename {
    id?: number;
    folderName: string;
}

export interface FolderMove {
    id?: number;
    parentId: number;
}

export enum FolderType {
    inbox = 1,
    sent = 2,
    trash = 3,
    archive = 4,
    personal = 5,
    other = 6,
}