import { UserTypes } from '..';
import { EmployeeTypes } from './employee-types';

export interface Comment {
    by: string;
    userType: UserTypes | EmployeeTypes;
    timestamp: Date;
    description: string;
}