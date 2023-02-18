import { Request, Response, NextFunction } from 'express';
import { openIdaAuthorizationUrl } from '~/openID';
import { getJWTToken } from '~/helpers/jwt';
import { USER_NOT_FOUND } from '~/ErrorMessages';
import userModel from '~/models/user/userModel';
import { getAlumniInfo } from '~/models/user/1c/requests/getAlumniInfo';
import userFromOneC from '~/models/user/1c/requests/UserFromOneCModel';
import { User } from '~/models/user/interfaces/user';

const authenticateViaSso = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const email = res.locals.email;
        const tokenExpiresIn = res.locals.expiresIn;
        if (email) {
            const { data } = await userModel.getUserByEmail(email!);
            if (data) {
                login(req, res, data, tokenExpiresIn);
            } else {
                const userData = await getAlumniInfo(email);
                if (userData.data) {
                    if (userFromOneC.validateAlumniStatus(userData.data)) {
                        const { data, errorMessage } =
                            await userModel.createUserByEmail(
                                email!,
                                userData.data,
                            );
                        if (data) {
                            login(req, res, data, tokenExpiresIn);
                        } else {
                            const redirectUrl = `/auth?error=${errorMessage}`;
                            res.status(400).redirect(redirectUrl);
                        }
                    } else {
                        const redirectUrl = `/auth?error=user is not alumni`;
                        res.status(400).redirect(redirectUrl);
                    }
                }
                next();
            }
        } else {
            next(Error(USER_NOT_FOUND));
        }
    } catch (e) {
        next(e);
    }
};

const login = (
    req: Request,
    res: Response,
    user: User,
    tokenExpiresIn: any,
) => {
    req.login(user, { session: false }, async error => {
        const body = {
            _id: user.id,
            email: user.email,
            name: user.firstName,
        };
        const token = getJWTToken(body, tokenExpiresIn);
        const redirectUrl = `/handleSSO?access_token=${token}`;
        res.status(200).redirect(redirectUrl);
    });
};

const sendOpenIdaAuthorizationUrl = (req: Request, res: Response) => {
    res.send(JSON.stringify(openIdaAuthorizationUrl));
};

export default { authenticateViaSso, sendOpenIdaAuthorizationUrl };
