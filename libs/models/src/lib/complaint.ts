import { Department } from './department';
import { Building } from './building';
import { Student } from './student';
import { ComplaintStatus } from './complaint-status';
import { Comment } from "./comment";
import { Model } from 'mongoose';
import { User } from './user';
export interface Complaint extends Model<any> {
    _id: string;
    createdBy: User;
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
    assignedTo?: User;
    [key: string]: any;
}