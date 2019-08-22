import { Department } from './department';
import { Employee } from './employee';
import { Building } from './building';
import { Student } from './student';
import { ComplaintStatus } from './complaint-status';
import { Comment } from "./comment";
import { Model } from 'mongoose';

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
    comments: Comment[];
    status: ComplaintStatus;
    assignedToId?: string;
    assignedTo?: Employee;
    [key: string]: any;
}