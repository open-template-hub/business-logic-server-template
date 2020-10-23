/**
 * @description holds context
 */

import { MongoDbProvider } from './providers/mongodb.provider';
import { getCurrentUser } from './services/auth.service';

export const context = async (req: any, mongoDbProvider: MongoDbProvider, publicPaths: string[]) => {

 let currentUser: any;
 let publicPath = false;

 for (const path of publicPaths) {
  if (req.path.startsWith(path)) {
   publicPath = true;
   break;
  }
 }

 if (!publicPath) {
  currentUser = await getCurrentUser(req);
 }

 return {mongoDbProvider, currentUser};
}
