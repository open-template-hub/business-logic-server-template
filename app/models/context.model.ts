import {MongoDbProvider} from "../providers/mongodb.provider";

export interface Context {
    mongoDbProvider: MongoDbProvider;
    currentUser: string;
}
