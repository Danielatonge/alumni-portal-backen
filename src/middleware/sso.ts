import { Request, Response, NextFunction } from 'express';
import { client } from '~/openID';
import { nonce } from '~/openID';
import { REDIRECT_URI } from '~/consts';
import { expiresIn } from '~/helpers/jwt';
import { USER_NOT_FOUND_IN_TOKEN_SET } from '~/ErrorMessages';

export const ssoMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const params = client.callbackParams(req);
        const tokenSet = await client.callback(REDIRECT_URI, params, { nonce });
        const { email, exp } = tokenSet.claims();
        if(!email){
            next(Error(USER_NOT_FOUND_IN_TOKEN_SET))
            return
        }
        res.locals.expiresIn = expiresIn(exp);
        res.locals.email = email;
        next();
    } catch (err) {
        next(err);
    }
};