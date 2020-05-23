/**
 * @description holds token service
 */

import { verify, TokenExpiredError } from 'jsonwebtoken';

export const verifyAccessToken = async (accessToken) => {
    try {
        return verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (e) {
        if (e instanceof TokenExpiredError) {
            throw new Error('Token expired');
        }
    }
};