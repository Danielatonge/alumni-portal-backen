import { Request, Response, NextFunction } from 'express';
import tagsModel, { Tag } from '~/models/courses/tag';
import { REQUIRED_DATA_NOT_EXIST, SOMETHING_WENT_WRONG } from '~/ErrorMessages';

const getAllTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { errorMessage, data } = await tagsModel.getAllTags();
        if (errorMessage || !data) {
            return res.status(400).json({
                message: errorMessage || SOMETHING_WENT_WRONG,
            });
        }
        return res.json({ tags: data });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err || SOMETHING_WENT_WRONG,
        });
    }
};

const createTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                message: REQUIRED_DATA_NOT_EXIST,
            });
        }
        const { errorMessage, data } = await tagsModel.createTag(name);
        if (errorMessage || !data) {
            return res.status(400).json({
                message: errorMessage || SOMETHING_WENT_WRONG,
            });
        }
        return res.json({ tags: data });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err || SOMETHING_WENT_WRONG,
        });
    }
};

export default { getAllTags, createTag };
