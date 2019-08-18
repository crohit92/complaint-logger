import { Department } from './department';
import { Employee } from './employee';
import { Building } from './building';

export interface Complaint {
    _id: string;
    createdBy: string;
    createdAt: number;
    mobile: string;
    departmentId: string;
    department?: Department;
    description: string;
    buildingId: string;
    building?: Building; //dd
    room?: string;
    resolution?: {
        description: string;
        status: string;
    },
    assignedToId?: string;
    assignedTo?: Employee;
    [key: string]: any;
}