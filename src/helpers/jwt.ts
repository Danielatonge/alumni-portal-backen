import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '~/db/const';

export const parseJwt = (token: string) => {
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var buf = Buffer.from(base64, 'base64')
        var jsonPayload = decodeURIComponent(buf.toString().split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

export const expiresIn = (expiresAt: number) => {
    var currentTimeSeconds = Math.round(+new Date()/1000);
    return expiresAt - currentTimeSeconds
}

export const getJWTToken = (user: { _id: number, email: string}, expiresIn: any) =>
    jwt.sign({ user: user }, JWT_SECRET, { expiresIn: expiresIn });