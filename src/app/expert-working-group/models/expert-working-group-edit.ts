import { ExpertApprovement } from "./expert-approvement";

export interface ExpertWorkingGroupEdit {
    title: string;
    categoryId: number;
    expertAppointments: ExpertApprovement[];
}
