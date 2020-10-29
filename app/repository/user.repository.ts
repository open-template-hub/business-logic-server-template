/**
 * @description holds user model
 */

import mongoose from 'mongoose';
import {MongoDbProvider} from "../providers/mongodb.provider";

export class UserRepository {
    private readonly collectionName: string = 'users';
    private userSchema: mongoose.Schema;

    constructor(private readonly provider: MongoDbProvider) {
        /**
         * User schema
         */
        const schema: mongoose.SchemaDefinition = {
            username: {type: String, unique: true, required: true, dropDups: true},
            payload: {type: Object}
        };
        this.userSchema = new mongoose.Schema(schema);
    }

    /**
     * creates user model
     * @return User model
     */
    getRepository = () => {
        return this.provider.getConnection().model(this.collectionName, this.userSchema, this.collectionName);
    }
}
