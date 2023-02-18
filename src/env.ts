import dotenv from 'dotenv';
import path from 'path';
const __dirname = path.resolve();

dotenv.config({
    override: true,
    path: path.join(__dirname, `./.env`),
});
