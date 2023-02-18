import { NextFunction, Request, Response } from 'express';
import { USER_IS_NOT_ADMIN, USER_NOT_FOUND } from '~/ErrorMessages';
import userModel from '~/models/user/userModel';

export const authenticateAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { _id } = req.user as { _id: number };
        const { data, errorMessage } = await userModel.getUserById(_id);
        if (!data) {
            return res.status(401).json({
                message: errorMessage || USER_NOT_FOUND,
            });
        }
        const currentUser = userModel.mapToDomain(data!);
        if (!userModel.isAdmin(currentUser)) {
            return res.status(403).json({
                message: USER_IS_NOT_ADMIN,
            });
        }
        next();
    } catch (err) {
        next(err);
    }
};
