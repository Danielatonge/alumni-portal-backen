import bcrypt from 'bcryptjs';
import { SALT } from '~/db/const';
import { AppDataSource } from '~/data-source';
import { UserFromDb } from '~/db/entities/UserFromDb';
import { validate } from 'class-validator';
import { USER_ALREADY_EXIST_ERROR, USER_NOT_FOUND } from '~/ErrorMessages';
import { QueryResult } from '~/models/types/queryResult';
import { User } from '~/models/user/interfaces/user';
import { UserFromOneC } from '~/models/user/interfaces/UserFromOneC';
import { ROLES } from '~/auth/const/roles';

const mapToDomain = (userFromDb: UserFromDb) =>
    <User>{
        id: userFromDb.id,
        firstName: userFromDb.firstName,
        lastName: userFromDb.lastName,
        dateGraduation: userFromDb.dateGraduation,
        email: userFromDb.email,
        history: JSON.parse(userFromDb.history),
        passwordHash: userFromDb.passwordHash,
        role: userFromDb.role,
    };

const createUserByEmail = async (
    email: string,
    userData: UserFromOneC,
): Promise<QueryResult<User>> => {
    try {
        const userFromDb = new UserFromDb();
        userFromDb.firstName = userData.firstName;
        userFromDb.lastName = userData.lastName;
        userFromDb.dateGraduation = userData.dateGraduation;
        userFromDb.history = JSON.stringify(userData.history);
        userFromDb.email = email;
        return await createUser(userFromDb);
    } catch (e) {
        return {
            errorMessage: e,
            data: null,
        };
    }
};

const createUserByPassword = async (
    email: string,
    password: string,
    userData: UserFromOneC,
): Promise<QueryResult<User>> => {
    try {
        const hashedPassword = await bcrypt.hash(password, SALT);
        const userFromDb = new UserFromDb();
        userFromDb.firstName = userData.firstName;
        userFromDb.lastName = userData.lastName;
        userFromDb.dateGraduation = userData.dateGraduation;
        userFromDb.history = JSON.stringify(userData.history);
        userFromDb.email = email;
        userFromDb.passwordHash = hashedPassword;
        return await createUser(userFromDb);
    } catch (e) {
        return {
            data: null,
            errorMessage: e,
        };
    }
};

const createUser = async (
    userFromDb: UserFromDb,
): Promise<QueryResult<User>> => {
    try {
        const repository = await AppDataSource.getRepository(UserFromDb);
        const errors = await validate(userFromDb);
        if (errors.length > 0) {
            console.log(errors[0]);
            return {
                data: null,
                errorMessage:
                    errors[0].constraints?.isEmail ||
                    errors[0].constraints?.innopolisEmailValidator,
            };
        } else {
            await repository.save(userFromDb);
            return getUserByEmail(userFromDb.email);
        }
    } catch (e: any) {
        return {
            data: null,
            errorMessage: USER_ALREADY_EXIST_ERROR,
        };
    }
};

const getUserByEmail = async (email: string): Promise<QueryResult<User>> => {
    const repository = await AppDataSource.getRepository(UserFromDb);
    const userFromDb = await repository.findOneBy({
        email,
    });
    if (userFromDb) {
        return {
            data: mapToDomain(userFromDb!),
            errorMessage: null,
        };
    }
    return {
        data: null,
        errorMessage: USER_NOT_FOUND,
    };
};

const getUserById = async (id: number): Promise<QueryResult<UserFromDb>> => {
    const repository = await AppDataSource.getRepository(UserFromDb);
    const userFromDb = await repository.findOneBy({
        id,
    });
    if (userFromDb) {
        return {
            data: userFromDb,
            errorMessage: null,
        };
    }
    return {
        data: null,
        errorMessage: USER_NOT_FOUND,
    };
};

const verifyUser = async (user: User, password: string): Promise<Boolean> => {
    try {
        return await bcrypt.compare(password, user.passwordHash);
    } catch (e) {
        console.log(e);
        return false;
    }
};

const isAdmin = (user: User) => user.role === ROLES.ADMIN;

export default {
    mapToDomain,
    verifyUser,
    createUserByEmail,
    createUserByPassword,
    getUserByEmail,
    getUserById,
    isAdmin,
};
