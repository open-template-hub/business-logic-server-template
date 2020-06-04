/**
 * @description holds context
 */

import { getConnection } from './database/Provider';
import { getCurrentUser } from './services/authService';

export const context = async (req) => {

 const dbConn = await getConnection();

 const currentUser = await getCurrentUser(req);

 return {dbConn, currentUser};
}
