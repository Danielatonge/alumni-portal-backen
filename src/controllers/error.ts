import { Request, Response } from 'express';

export const handleRoutingError = (req: Request, res: Response) => {
    res.send('The URL you are trying to reach does not exist.');
};

export default { handleRoutingError };
