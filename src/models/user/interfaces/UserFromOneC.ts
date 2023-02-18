import { UserHistory } from '~/models/user/interfaces/UserHistory';

export interface UserFromOneC {
    firstName: string;
    lastName: string;
    status: string;
    degree: string;
    group: string;
    dateGraduation: Date;
    history: UserHistory[];
}
