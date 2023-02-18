import '~/env';
export const CLIENT_ID = process.env.OPEN_ID_CLIENT_ID || '';
export const CLIENT_SECRET = process.env.OPEN_ID_CLIENT_SECRET || '';
export const REDIRECT_URI = process.env.SSO_CALLBACK || '';
export const OPEN_ID_CONFIG_URL = process.env.OPEN_ID_CONFIG_URL || '';
