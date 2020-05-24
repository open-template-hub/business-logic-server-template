/**
 * @description holds token service
 */

import { TokenExpiredError, verify } from 'jsonwebtoken';

export const verifyAccessToken = async (accessToken) => {
 try {
  return verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
 } catch (e) {
  if (e instanceof TokenExpiredError) {
   e.responseCode = 401;
  } else {
   e.responseCode = 403;
  }
  throw e;
 }
};
