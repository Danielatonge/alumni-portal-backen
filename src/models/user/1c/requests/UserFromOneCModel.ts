import {
    UserFromOneCData,
    UserHistoryData,
} from '~/models/user/1c/requests/userFromOneCResponse';
import { UserFromOneC } from '~/models/user/interfaces/UserFromOneC';
import { UserHistory } from '~/models/user/interfaces/UserHistory';
import { IS_ALUMNI_STUDENT } from '~/models/user/consts';
import {
    BARCHELOR,
    BARCHELOR_RU,
    MAGISTR_RU,
    MAGISTR,
    ALUMNI,
} from '~/models/user/consts';

const historyFromResponse = (data: UserHistoryData) =>
    <UserHistory>{
        status: parseStatus(data.Status),
        degree: parseDegree(data.Degree),
        group: data.Group,
    };

const fromResponseData = (data: UserFromOneCData) =>
    <UserFromOneC>{
        firstName: data.en_FirstName,
        lastName: data.en_LastName,
        status: data.Status,
        degree: data.Degree,
        group: data.Group,
        dateGraduation: parseGraduationDate(data.Date_graduation),
        history: data.History.map(data => historyFromResponse(data)),
    };

const parseGraduationDate = (dateString: string | null) => {
    if (dateString && dateString.length != 0) {
        const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
        return new Date(dateString.replace(pattern, '$3-$2-$1'));
    }
    return null;
};

const parseDegree = (degree: string) => {
    switch (degree) {
        case BARCHELOR_RU:
            return BARCHELOR;
        case MAGISTR_RU:
            return MAGISTR;
        default:
            return degree;
    }
};

const parseStatus = (status: string) => {
    if (status === IS_ALUMNI_STUDENT) {
        return ALUMNI;
    }
    return status;
};

const validateAlumniStatus = (userFromOneC: UserFromOneC) =>
    userFromOneC.status === ALUMNI ||
    userFromOneC?.history.some(({ status }) => status === ALUMNI);

export default { fromResponseData, validateAlumniStatus };
