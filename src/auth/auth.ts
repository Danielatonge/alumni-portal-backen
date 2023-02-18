import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTstrategy, ExtractJwt } from 'passport-jwt';
import userModel from '../models/user/userModel';
import { JWT_SECRET } from '~/db/const';
import { getAlumniInfo } from '~/models/user/1c/requests/getAlumniInfo';
import { validateEmail } from '~/helpers/InnopolisEmailValidator';
import userFromOneC from '~/models/user/1c/requests/UserFromOneCModel';
import {
    INVALID_EMAIL_ADDRESS,
    SOMETHING_WENT_WRONG,
    USER_IS_NOT_ALUMNI,
    USER_NOT_FOUND,
    WRONG_PASSWORD,
} from '~/ErrorMessages';

passport.use(
    'signup',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (name, password, done) => {
            try {
                const isEmailValid = validateEmail(name);
                if (!isEmailValid) {
                    return done(INVALID_EMAIL_ADDRESS);
                }
                const userData = await getAlumniInfo(name);
                if (!userData.data) {
                    return done(userData.errorMessage || USER_IS_NOT_ALUMNI);
                }
                if (!userFromOneC.validateAlumniStatus(userData.data)) {
                    return done(USER_IS_NOT_ALUMNI);
                }
                const { data, errorMessage } =
                    await userModel.createUserByPassword(
                        name,
                        password,
                        userData.data,
                    );
                if (data) {
                    return done(null, data);
                } else {
                    return done(errorMessage || SOMETHING_WENT_WRONG);
                }
            } catch (error) {
                console.log(error);
                done(error);
            }
        },
    ),
);

passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const { data, errorMessage } = await userModel.getUserByEmail(
                    email,
                );
                if (!data) {
                    return done(errorMessage || USER_NOT_FOUND);
                }
                const validate = await userModel.verifyUser(data, password);
                if (!validate) {
                    return done(WRONG_PASSWORD);
                }
                return done(null, data, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        },
    ),
);

passport.use(
    new JWTstrategy(
        {
            secretOrKey: JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        },
    ),
);
