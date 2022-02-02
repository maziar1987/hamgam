import { Orgunit } from "src/app/basicinfo/orgunit/orgunit.model";
import { ExpertApprovement } from "./expert-approvement";

export interface ExpertWorkingGroup {
    id: number;
    title: string;
    category: Orgunit;
    categoryId: number;
    expertAppointments: ExpertApprovement[];
    lastEditDate: Date;
    memberCount: number;
}
