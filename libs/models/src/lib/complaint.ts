import { Department } from './department';

export interface Complaint {

    createdBy: string;
    createdAt: number;
    mobile: string;
    departmentId: string;
    department?: Department;
    description: string;
    buildingId: string;
    buildingName?: string; //dd
    room?: string;
    resolution?: {
        description: string;
        status: string;
    }
}