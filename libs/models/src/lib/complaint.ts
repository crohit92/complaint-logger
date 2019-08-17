import { Department } from './department';
import { Employee } from './employee';

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
    },
    assignedToId?: string;
    assignedTo?: Employee;
}