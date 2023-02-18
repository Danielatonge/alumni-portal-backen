import router from 'express';
import ROUTES from './routes';
import passport from 'passport';
import { ssoMiddleware } from '~/middleware/sso';
import errorController from '../controllers/error';
import authController from '../controllers/auth';
import ssoController from '../controllers/sso';
import profileController from '../controllers/profile';
import courseController from '../controllers/course';
import tags from '../controllers/tags';
import '../auth/auth';
import { authenticateAdmin } from '~/middleware/authenticateAdmin';

const routerInstance = router.Router();

routerInstance.get(ROUTES.MAIN, (req, res) => {
    res.send('MAIN');
});
//SSO
routerInstance.post(
    ROUTES.SSO,
    ssoMiddleware,
    ssoController.authenticateViaSso,
);
routerInstance.get(
    ROUTES.SSO_AUTHORIZATION_URL,
    ssoController.sendOpenIdaAuthorizationUrl,
);

//AUTH
routerInstance.post(ROUTES.SIGN_UP, authController.signup);
routerInstance.post(ROUTES.SIGN_IN, authController.login);

routerInstance.get(
    ROUTES.PROFILE,
    passport.authenticate('jwt', { session: false }),
    profileController.getUserProfile,
);

// COURSES
routerInstance.get(
    ROUTES.COURSES,
    passport.authenticate('jwt', { session: false }),
    courseController.getAllCourses,
);

routerInstance.post(
    ROUTES.COURSES,
    passport.authenticate('jwt', { session: false }),
    authenticateAdmin,
    courseController.createCourse,
);

routerInstance.get(
    ROUTES.USER_COURSES,
    passport.authenticate('jwt', { session: false }),
    courseController.getUserCourses,
);

routerInstance.post(
    ROUTES.APPLY_TO_COURSE,
    passport.authenticate('jwt', { session: false }),
    courseController.applyToTheCourse,
);

routerInstance.post(
    ROUTES.UNAPPLY_FROM_COURSE,
    passport.authenticate('jwt', { session: false }),
    courseController.unapplyFromTheCourse,
);

routerInstance.patch(
    ROUTES.COURSE_STATUS,
    passport.authenticate('jwt', { session: false }),
    authenticateAdmin,
    courseController.changeCourseStatus,
);

routerInstance.get(
    ROUTES.TAGS,
    passport.authenticate('jwt', { session: false }),
    tags.getAllTags,
);

routerInstance.post(
    ROUTES.TAGS,
    passport.authenticate('jwt', { session: false }),
    authenticateAdmin,
    tags.createTag,
);

routerInstance.get(
    ROUTES.COURSE_REQUESTS,
    passport.authenticate('jwt', { session: false }),
    courseController.getAllCourseRequests,
);

//ERROR
routerInstance.get(ROUTES.ERROR, errorController.handleRoutingError);

export default routerInstance;
