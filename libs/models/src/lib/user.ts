import { UserTypes } from './user-types';
import { Department } from './department';

export interface User {
    admin: boolean;
    department?: Department;
    password?: string;
    type: UserTypes;
    loginId: string;
    name: string;
    mobile: string;
    photoUrl?: string;
    [key: string]: any;
}