import { PolicyCategory } from "./policy-category";

export interface PolicySet {
    id: number;
    name: string;
    lastEditor: string;
    lastEditDate: Date;
    description: string;
    active: boolean;
    deletable: boolean;
    menusIds: number[];
    categories: PolicyCategory[];
}
