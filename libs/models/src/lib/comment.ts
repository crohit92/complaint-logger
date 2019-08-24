import { UserTypes } from '..';

export interface Comment {
    by: string;
    userType: UserTypes;
    timestamp: Date;
    description: string;
}