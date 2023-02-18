export type UserHistoryData = {
    Status: string;
    Degree: string;
    Group: string;
};

export type UserFromOneCData = {
    en_FirstName: string;
    en_LastName: string;
    Status: string;
    Degree: string;
    Group: string;
    Date_graduation: string;
    History: Array<UserHistoryData>;
};

export type userEmail = string;

export type ONE_C_USER_RESPONSE = Record<userEmail, UserFromOneCData>;
