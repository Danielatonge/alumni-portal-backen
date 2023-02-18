import cors from 'cors';
import 'dotenv/config';
import "reflect-metadata"
import express, { Express } from 'express';
import '~/env';
import Router from '~/routes';
import passport from 'passport';
import errorMiddleWare from '~/middleware/error';
import { AppDataSource } from '~/data-source';

const app: Express = express();
const port = process.env.PORT || 8000;
const { errorHandler, errorLogger } = errorMiddleWare;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(errorHandler);
app.use(errorLogger);
app.use(passport.initialize());
app.use(passport.session());
app.use('/', Router);

AppDataSource.initialize().then(async () => {
    AppDataSource.runMigrations().then(() => {
        app.listen(port, () => {
            console.log(
                `⚡️[server]: Server is running at https://localhost:${port}`,
            );
        });
    })
})
