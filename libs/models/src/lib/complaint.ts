import { Department } from './department';
import { Employee } from './employee';
import { Building } from './building';
import { Student } from './student';

export interface Complaint {
    _id: string;
    createdBy: Student;
    createdAt: number;
    mobile: string;
    department?: Department;
    description: string;
    buildingId: string;
    building?: Building; //dd
    room?: string;
    resolution?: {
        description: string;
        statusByTechnician: string;
        status: string;
    },
    assignedToId?: string;
    assignedTo?: Employee;
    [key: string]: any;
}