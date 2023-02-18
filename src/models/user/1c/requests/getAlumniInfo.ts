import { HTTPSrequest } from '~/helpers/httpRequest';
import '~/env';
import userFromOneC from '~/models/user/1c/requests/UserFromOneCModel';
import { QueryResult } from '~/models/types/queryResult';
import { ONE_C_USER_RESPONSE } from '~/models/user/1c/requests/userFromOneCResponse';
import { EMAIL_DOES_NOT_EXIST } from '~/ErrorMessages';
import { UserFromOneC } from '~/models/user/interfaces/UserFromOneC';

const host = process.env.ONE_C_HOSTNAME || '';
const username = process.env.ONE_C_USERNAME;
const password = process.env.ONE_C_PASSWORD;
const path = '/testuniver/hs/student_info/get_graduate_Info?email=';
const auth = `Basic ${Buffer.from(`${username}:${password}`).toString(
    'base64',
)}`;

const options = (email: string) => ({
    hostname: host,
    path: `${path}${email}`,
    port: 443,
    method: 'GET',
    headers: { Host: host, Authorization: auth },
});

export const getAlumniInfo = async (
    email: string,
): Promise<QueryResult<UserFromOneC>> => {
    try {
        const request = await HTTPSrequest(options(email));
        const data = request as ONE_C_USER_RESPONSE;
        if (data && data[email]) {
            return {
                data: userFromOneC.fromResponseData(data[email]),
                errorMessage: null,
            };
        } else {
            return {
                data: null,
                errorMessage: EMAIL_DOES_NOT_EXIST,
            };
        }
    } catch (err) {
        return {
            data: null,
            errorMessage: EMAIL_DOES_NOT_EXIST,
        };
    }
};
