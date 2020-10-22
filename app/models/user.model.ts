/**
 * @description holds user model
 */

import mongoose from 'mongoose';

/**
 * User schema
 */
const schema: mongoose.SchemaDefinition = {
 username: {type: String, unique: true, required: true, dropDups: true},
 payload: {type: Object}
};

// user collection name
const collectionName: string = 'user';

const userSchema: mongoose.Schema = new mongoose.Schema(schema);

/**
 * creates user model
 * @param conn providers connection
 * @returns user model
 */
const UserModel = (conn: mongoose.Connection) =>
 conn.model(collectionName, userSchema);

export default UserModel;
