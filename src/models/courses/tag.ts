import { CourseTagFromDb } from '~/db/entities/CourseTagFromDb';
import { AppDataSource } from '~/data-source';
import { QueryResult } from '~/models/types/queryResult';

export interface Tag{
    id: number;
    name: string;
}

const mapToDomain = (tagFromDb: CourseTagFromDb) => <Tag>{
    id: tagFromDb.id,
    name: tagFromDb.name
}

const mapToDb = (tag: Tag) => <CourseTagFromDb>{
    id: tag.id,
    name: tag.name
}

const getAllTags = async (): Promise<QueryResult<Tag[]>> => {
    try {
        const repository = AppDataSource.getRepository(CourseTagFromDb)
        const tags = await repository.find()
        return {
            data: tags.map( tag => mapToDomain(tag) ),
            errorMessage: null
        }
    } catch (e) {
        console.log(e)
        return {
            data: null,
            errorMessage: e
        }
    }
}

const getTagsByIds = async (ids: number[]): Promise<QueryResult<Tag[]>> => {
    try {
        const repository = AppDataSource.getRepository(CourseTagFromDb)
        const tags = await repository.createQueryBuilder("tag")
            .where("tag.id IN (:ids)", {ids: ids})
            .getMany()
        return {
            data: tags.map( tag => mapToDomain(tag) ),
            errorMessage: null
        }
    } catch (e) {
        console.log(e)
        return {
            data: null,
            errorMessage: e
        }
    }
}

const createTag = async (name: string): Promise<QueryResult<Tag[]>> => {
    try {
        const repository = AppDataSource.getRepository(CourseTagFromDb);
        const tag = new CourseTagFromDb();
        tag.name = name;
        await repository.save(tag);
        return getAllTags();
    } catch (e) {
        console.log(e)
        return {
            data: null,
            errorMessage: e
        }
    }
}

export default {mapToDomain, mapToDb, getAllTags, createTag, getTagsByIds}