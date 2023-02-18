import { UserFromDb } from '~/db/entities/UserFromDb';
import { CourseFromDb } from '~/db/entities/CourseFromDb';
import { AppDataSource } from '~/data-source';
import { CourseRequestFromDb } from '~/db/entities/CourseRequestFromDb';
import { QueryResult } from '~/models/types/queryResult';
import {
    USER_ALREADY_APPLIED_TO_MAXIMUM_AMOUNT_OF_COURSES,
    USER_ALREADY_APPLIED_TO_THE_COURSE,
} from '~/ErrorMessages';

export enum CourseRequestStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    REJECTED = 'REJECTED',
}

const createCourseRequest = async (
    userFromDb: UserFromDb,
    courseFromDb: CourseFromDb,
): Promise<QueryResult<boolean>> => {
    try {
        const repository = await AppDataSource.getRepository(
            CourseRequestFromDb,
        );
        const courseRequestCount = await userCourseRequestsCount(userFromDb);
        console.log(courseRequestCount);
        if (courseRequestCount >= 3) {
            return {
                data: null,
                errorMessage: USER_ALREADY_APPLIED_TO_MAXIMUM_AMOUNT_OF_COURSES,
            };
        }
        const isCourseAlreadyRequestExist = await isCourseRequestExist(
            userFromDb,
            courseFromDb,
        );
        if (isCourseAlreadyRequestExist) {
            return {
                data: null,
                errorMessage: USER_ALREADY_APPLIED_TO_THE_COURSE,
            };
        }
        const courseRequest = new CourseRequestFromDb();
        courseRequest.user = userFromDb;
        courseRequest.course = courseFromDb;
        if (courseFromDb.autoConfirm) {
            courseRequest.status = CourseRequestStatus.CONFIRMED;
        } else {
            courseRequest.status = CourseRequestStatus.PENDING;
        }
        await repository.save(courseRequest);
        return {
            data: true,
            errorMessage: null,
        };
    } catch (e) {
        console.log(e);
        return {
            data: null,
            errorMessage: e,
        };
    }
};

const deleteCourseRequest = async (
    userFromDb: UserFromDb,
    courseFromDb: CourseFromDb,
): Promise<QueryResult<boolean>> => {
    try {
        const repository = await AppDataSource.getRepository(
            CourseRequestFromDb,
        );
        await repository
            .createQueryBuilder()
            .delete()
            .where('userId=:userId AND courseId=:courseId', {
                userId: userFromDb.id,
                courseId: courseFromDb.id,
            })
            .execute();
        return {
            data: true,
            errorMessage: null,
        };
    } catch (e) {
        console.log(e);
        return {
            data: null,
            errorMessage: e,
        };
    }
};

const changeCoursesStatus = async (
    requestIds: number[],
    status: CourseRequestStatus,
): Promise<QueryResult<boolean>> => {
    try {
        const repository = await AppDataSource.getRepository(
            CourseRequestFromDb,
        );
        await repository
            .createQueryBuilder()
            .update()
            .set({ status: status })
            .where('id IN (:ids)', { ids: requestIds })
            .execute();
        return {
            data: true,
            errorMessage: null,
        };
    } catch (e) {
        console.log(e);
        return {
            data: null,
            errorMessage: e,
        };
    }
};

const isCourseRequestExist = async (
    userFromDb: UserFromDb,
    courseFromDb: CourseFromDb,
): Promise<boolean> => {
    const courseRequest = await getCourseRequest(userFromDb, courseFromDb);
    return courseRequest !== null;
};

const userCourseRequestsCount = async (
    userFromDb: UserFromDb,
): Promise<number> => {
    const repository = await AppDataSource.getRepository(CourseRequestFromDb);
    return await repository
        .createQueryBuilder()
        .select()
        .where('userId=:userId', { userId: userFromDb.id })
        .getCount();
};

const getCourseRequest = async (
    userFromDb: UserFromDb,
    courseFromDb: CourseFromDb,
) => {
    const repository = await AppDataSource.getRepository(CourseRequestFromDb);
    return await repository
        .createQueryBuilder()
        .select()
        .where('userId=:userId AND courseId=:courseId', {
            userId: userFromDb.id,
            courseId: courseFromDb.id,
        })
        .getOne();
};

const getAllCourseRequests = async (): Promise<
    QueryResult<CourseRequestFromDb[]>
> => {
    try {
        const repository = await AppDataSource.getRepository(
            CourseRequestFromDb,
        );
        const requests = await repository.find({
            relations: {
                course: true,
                user: true,
            },
        });
        return {
            data: requests,
            errorMessage: null,
        };
    } catch (err) {
        return {
            data: null,
            errorMessage: err,
        };
    }
};

export default {
    createCourseRequest,
    changeCoursesStatus,
    deleteCourseRequest,
    getAllCourseRequests,
};
