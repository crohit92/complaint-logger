import { UserTypes } from './user-types';

export interface User {
    type: UserTypes;
    loginId: string;
    name: string;
    [key: string]: any;
}