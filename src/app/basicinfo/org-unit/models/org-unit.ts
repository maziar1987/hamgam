export interface OrgUnit {
    id: number;
    displayName: string;
    code: string;
    parentId: number | null;
    activated: boolean;
    viewOrder: number
}
