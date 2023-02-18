import '../env';

export const SALT = process.env.SALT || '';
export const JWT_SECRET = process.env.JWT_SECRET || 'SECRET_KEY';
