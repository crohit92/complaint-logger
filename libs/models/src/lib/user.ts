import { UserType } from './user-type';

export interface User {
    type: UserType;
    loginId: string;
    name: string;
    [key: string]: any;
}