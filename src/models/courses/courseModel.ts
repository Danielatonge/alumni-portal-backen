import { AppDataSource } from '~/data-source';
import { CourseFromDb } from '~/db/entities/CourseFromDb';
import { QueryResult } from '~/models/types/queryResult';
import { CourseTagFromDb } from '~/db/entities/CourseTagFromDb';
import { Course } from '~/models/courses/interfaces/course';

const mapToDomain = (courseFromDb: CourseFromDb, currentUserId: number) =>
    <Course>{
        id: courseFromDb.id,
        name: courseFromDb.name,
        description: courseFromDb.description,
        teachers: courseFromDb.teachers,
        tags: courseFromDb.tagsFromDb?.map(tag => tag.name) || [],
        slotsAvailable: courseFromDb.slotsAvailable,
        slotsOccupied: courseFromDb.courseRequestsFromDb?.length || 0,
        startDate: courseFromDb.startDate,
        endDate: courseFromDb.endDate,
        applied: courseFromDb.courseRequestsFromDb.some(
            item => item.user.id === currentUserId,
        ),
    };

const getAllCourses = async (
    currentUserId: number,
): Promise<QueryResult<Course[]>> => {
    try {
        const repository = await AppDataSource.getRepository(CourseFromDb);
        const courses = await repository.find({
            relations: {
                tagsFromDb: true,
                courseRequestsFromDb: true,
            },
        });
        return {
            data: courses.map(courseFromDb => {
                return mapToDomain(courseFromDb, currentUserId);
            }),
            errorMessage: null,
        };
    } catch (err) {
        console.log(err);
        return {
            data: null,
            errorMessage: err,
        };
    }
};

const getUserCourses = async (
    currentUserId: number,
): Promise<QueryResult<object[]>> => {
    try {
        const repository = await AppDataSource.getRepository(CourseFromDb);
        const courses = await repository
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.courseRequestsFromDb', 'courseRequest')
            .where('courseRequest.userId=:userId', { userId: currentUserId })
            .getMany();

        return {
            data: courses.map(course => {
                return {
                    id: course.id,
                    name: course.name,
                    description: course.description,
                    teachers: course.teachers,
                    tags: course.tagsFromDb?.map(tag => tag.name) || [],
                    startDate: course.startDate,
                    endDate: course.endDate,
                    courseRequestStatus: course.courseRequestsFromDb[0].status,
                    applied: true,
                };
            }),
            errorMessage: null,
        };
    } catch (err) {
        console.log(err);
        return {
            data: null,
            errorMessage: err,
        };
    }
};

const getCourseById = async (id: number) => {
    const repository = await AppDataSource.getRepository(CourseFromDb);
    return repository.findOne({
        relations: {
            tagsFromDb: true,
            courseRequestsFromDb: true,
        },
        where: {
            id,
        },
    });
};

const createCourse = async (
    currentUserId: number,
    name: string,
    description: string,
    slotsAvailable: number,
    startDate: Date,
    endDate: Date,
    autoConfirm: boolean,
    teachers: string[],
    tags: CourseTagFromDb[],
): Promise<QueryResult<Course[]>> => {
    try {
        const repository = await AppDataSource.getRepository(CourseFromDb);
        const course = new CourseFromDb();
        course.name = name;
        course.description = description;
        course.slotsAvailable = slotsAvailable;
        course.startDate = startDate;
        course.endDate = endDate;
        course.teachers = teachers;
        course.tagsFromDb = tags;
        course.autoConfirm = autoConfirm;
        await repository.save(course);
        return getAllCourses(currentUserId);
    } catch (err) {
        console.log(err);
        return {
            data: null,
            errorMessage: err,
        };
    }
};

export default {
    mapToDomain,
    getAllCourses,
    getUserCourses,
    getCourseById,
    createCourse,
};
