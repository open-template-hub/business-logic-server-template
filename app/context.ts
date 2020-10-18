/**
 * @description holds context
 */

import { getConnection } from './providers/mongodb.provider';
import { getCurrentUser } from './services/auth.service';

export const context = async (req) => {

 const dbConn = await getConnection();

 const currentUser = await getCurrentUser(req);

 return {dbConn, currentUser};
}
