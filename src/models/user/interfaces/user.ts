import { UserHistory } from './UserHistory';
export interface User {
    id: number;
    firstName: string | null;
    lastName: string | null;
    degree: string | null;
    group: string | null;
    dateGraduation: Date | null;
    email: string;
    history: UserHistory[];
    passwordHash: string;
    role: string;
}