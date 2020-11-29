/**
 * @description holds context
 */

import { MongoDbProvider } from './provider/mongo.provider';
import { getCurrentUser } from './util/auth.util';

export const context = async (
  req: any,
  mongoDbProvider: MongoDbProvider,
  publicPaths: string[]
) => {
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

  return { mongoDbProvider, currentUser };
};
