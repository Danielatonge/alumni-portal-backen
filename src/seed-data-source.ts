import { DataSource } from "typeorm";
import './env.js';

export const SeedDataSource = new DataSource({
    type: "mssql",
    host: process.env.DB_SERVER,
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ,
    synchronize: true,
    logging: true,
    migrations: ["dist/db/seeds/*.js"],
    subscribers: [],
})