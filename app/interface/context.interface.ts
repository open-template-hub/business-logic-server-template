import { MongoDbProvider } from '../provider/mongo.provider';

export interface Context {
  mongoDbProvider: MongoDbProvider;
  currentUser: string;
}
