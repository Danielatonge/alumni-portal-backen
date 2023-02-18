import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { getJWTToken } from '~/helpers/jwt';
import { SOMETHING_WENT_WRONG } from '~/ErrorMessages';
import { User } from '~/models/user/interfaces/user';

const signup = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('signup', async (err, user) => {
        try {
            if (err || !user) {
                res.status(400).json({
                    message: err || SOMETHING_WENT_WRONG,
                });
                return next(err);
            }
            const jwtBody = { _id: user.id, email: user.email };
            const token = getJWTToken(jwtBody, '2d');
            return res.status(200).setHeader('access_token', token).json({
                id: jwtBody._id,
                email: jwtBody.email,
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
};

const login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('login', async (err, user) => {
        try {
            if (err || !user) {
                return res.status(400).json({
                    message: err || SOMETHING_WENT_WRONG,
                });
            }
            req.login(user, { session: false }, async error => {
                if (error) return next(error);
                const user = req.user as User;
                const body = { _id: user.id, email: user.email };
                const token = getJWTToken(body, '2d');
                return res.status(200).setHeader('access_token', token).json({
                    id: body._id,
                    email: body.email,
                });
            });
        } catch (error) {
            return res.status(400).json({
                message: error || SOMETHING_WENT_WRONG,
            });
        }
    })(req, res, next);
};

export default { signup, login };
