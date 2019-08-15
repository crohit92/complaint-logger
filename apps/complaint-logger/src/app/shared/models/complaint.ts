import { Department } from './department';

export class Complaint {
    constructor() {
        this.createAt = Date.now();
    }
    createdBy: string;
    createAt: number;
    mobile: string;
    departmentId: Department;
    department?: Department;
    description: string;
    buildingName: string; //dd
    room?: string;
    resolution?: {
        description: string;
        status: string;
    }
}