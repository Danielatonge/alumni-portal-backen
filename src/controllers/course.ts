import { Request, Response, NextFunction } from 'express';
import courseModel from '~/models/courses/courseModel';
import userModel from '~/models/user/userModel';
import courseRequestModel from '~/models/courses/courseRequest';
import {
    COURSE_ID_MUST_NOT_BE_NULL,
    COURSE_NOT_FOUND,
    COURSE_REQUEST_STATUS_MUST_NOT_BE_NULL,
    ID_MUST_NOT_BE_NULL,
    REQUIRED_DATA_NOT_EXIST,
    SOMETHING_WENT_WRONG,
    USER_NOT_FOUND,
} from '~/ErrorMessages';
import tagsModel from '~/models/courses/tag';

const getAllCourses = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const currentUser = req.user as { _id: number };
        const { errorMessage, data } = await courseModel.getAllCourses(
            currentUser._id,
        );
        if (errorMessage || !data) {
            return res.status(400).json({
                message: errorMessage || SOMETHING_WENT_WRONG,
            });
        }
        return res.json({ courses: data });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err || SOMETHING_WENT_WRONG,
        });
    }
};

const getAllCourseRequests = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { data, errorMessage } =
            await courseRequestModel.getAllCourseRequests();
        if (!data || errorMessage) {
            return res.status(400).json({
                message: errorMessage || SOMETHING_WENT_WRONG,
            });
        }
        return res.json({ courseRequests: data });
    } catch (err) {
        return res.status(500).json({
            message: err || SOMETHING_WENT_WRONG,
        });
    }
};

const getUserCourses = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const currentUser = req.user as { _id: number };
        const { errorMessage, data } = await courseModel.getUserCourses(
            currentUser._id,
        );
        if (errorMessage || !data) {
            return res.status(400).json({
                message: errorMessage || SOMETHING_WENT_WRONG,
            });
        }
        return res.json({ courses: data });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err || SOMETHING_WENT_WRONG,
        });
    }
};

const applyToTheCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const currentUser = req.user as { _id: number };
        const courseId = req.body.courseId;
        if (!courseId) {
            return res.status(400).json({
                message: COURSE_ID_MUST_NOT_BE_NULL,
            });
        }

        const userFromDb = await userModel.getUserById(currentUser._id);
        const courseFromDb = await courseModel.getCourseById(courseId);
        if (!userFromDb.data) {
            return res.status(400).json({
                message: USER_NOT_FOUND,
            });
        }
        if (!courseFromDb) {
            return res.status(400).json({
                message: COURSE_NOT_FOUND,
            });
        }

        const { data, errorMessage } =
            await courseRequestModel.createCourseRequest(
                userFromDb.data!,
                courseFromDb!,
            );

        if (!data) {
            return res.status(400).json({
                message: errorMessage || SOMETHING_WENT_WRONG,
            });
        }

        return res.json({ success: data });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err || SOMETHING_WENT_WRONG,
        });
    }
};

const unapplyFromTheCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const currentUser = req.user as { _id: number };
        const courseId = req.body.courseId;
        if (!courseId) {
            return res.status(400).json({
                message: COURSE_ID_MUST_NOT_BE_NULL,
            });
        }

        const userFromDb = await userModel.getUserById(currentUser._id);
        const courseFromDb = await courseModel.getCourseById(courseId);
        if (!userFromDb.data) {
            return res.status(400).json({
                message: USER_NOT_FOUND,
            });
        }
        if (!courseFromDb) {
            return res.status(400).json({
                message: COURSE_NOT_FOUND,
            });
        }

        const { data, errorMessage } =
            await courseRequestModel.deleteCourseRequest(
                userFromDb.data!,
                courseFromDb!,
            );

        if (!data) {
            return res.status(400).json({
                message: errorMessage || SOMETHING_WENT_WRONG,
            });
        }

        return res.json({ success: data });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err || SOMETHING_WENT_WRONG,
        });
    }
};

const changeCourseStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const courseRequestIds = req.body.requestIds as number[];
        const status = req.body.status;
        if (!courseRequestIds || courseRequestIds.length === 0) {
            return res.status(400).json({
                message: ID_MUST_NOT_BE_NULL,
            });
        }
        if (!status) {
            return res.status(400).json({
                message: COURSE_REQUEST_STATUS_MUST_NOT_BE_NULL,
            });
        }

        const { errorMessage, data } =
            await courseRequestModel.changeCoursesStatus(
                courseRequestIds,
                status,
            );
        if (errorMessage || !data) {
            return res.status(400).json({
                message: errorMessage || SOMETHING_WENT_WRONG,
            });
        }
        return res.json({
            success: data,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err || SOMETHING_WENT_WRONG,
        });
    }
};

const createCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {
            name,
            description,
            slotsAvailable,
            startDate,
            endDate,
            teachers,
            tagIds,
            autoConfirm,
        } = req.body;

        if (
            !name ||
            !description ||
            !slotsAvailable ||
            !startDate ||
            !endDate ||
            !teachers ||
            !autoConfirm ||
            !tagIds
        ) {
            return res.status(400).json({
                message: REQUIRED_DATA_NOT_EXIST,
            });
        }
        const tags = await tagsModel.getTagsByIds(tagIds);
        const currentUser = req.user as { _id: number };
        const { errorMessage, data } = await courseModel.createCourse(
            currentUser._id,
            name,
            description,
            slotsAvailable,
            startDate,
            endDate,
            autoConfirm,
            teachers,
            tags.data || [],
        );
        if (errorMessage || !data) {
            return res.status(400).json({
                message: errorMessage || SOMETHING_WENT_WRONG,
            });
        }
        return res.json({
            courses: data,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err || SOMETHING_WENT_WRONG,
        });
    }
};

export default {
    getAllCourses,
    getUserCourses,
    applyToTheCourse,
    unapplyFromTheCourse,
    changeCourseStatus,
    createCourse,
    getAllCourseRequests,
};
