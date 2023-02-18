import { DataSource } from "typeorm"
import './env';
import { UserFromDb } from '~/db/entities/UserFromDb';
import { CourseFromDb } from '~/db/entities/CourseFromDb';
import { CourseRequestFromDb } from '~/db/entities/CourseRequestFromDb';
import { CourseTagFromDb } from '~/db/entities/CourseTagFromDb';

const entities = [
    UserFromDb,
    CourseFromDb,
    CourseRequestFromDb,
    CourseTagFromDb
]

export const AppDataSource = new DataSource({
    type: "mssql",
    host: process.env.DB_SERVER,
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ,
    synchronize: false,
    logging: true,
    entities: entities,
    migrations: ["dist/db/migrations/*.js"],
    subscribers: [],
})