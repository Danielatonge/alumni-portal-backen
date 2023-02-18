import { Request, Response } from 'express';
import userModel from '~/models/user/userModel';
import { USER_NOT_FOUND } from '../ErrorMessages';

const getUserProfile = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user as { _id: number; email: string };
        const user = await userModel.getUserByEmail(currentUser.email);
        if (!user.data) {
            return res.status(400).json({
                message: user.errorMessage || USER_NOT_FOUND,
            });
        }
        const { passwordHash, ...nonSensetivateData } = user.data;
        res.json({ user: nonSensetivateData });
    } catch (e) {
        res.json({ user: req.user });
    }
};

export default { getUserProfile };
