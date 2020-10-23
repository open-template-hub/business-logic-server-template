import { MongoDbProvider } from '../providers/mongodb.provider';

export const preload = async (mongoDbProvider: MongoDbProvider) => {
 await mongoDbProvider.preload();
}
