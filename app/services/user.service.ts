/**
 * @description holds crud operations for the user entity
 */

import UserModel from '../models/user.model'

/**
 * gets all users
 * @param dbConn dbConn
 * @returns user list
 */
export const getAllUsers = async (dbConn) => {
 let list = UserModel(dbConn).find();
 if (list != null) {
  list = list.map(u => {
   return u;
  });
 }
 return list;
}

/**
 * gets user by id
 * @param dbConn dbConn
 * @returns user or null
 */
export const getUser = async (dbConn, username) => {
 return UserModel(dbConn).findOne({username: username});
}

/**
 * creates user
 * @param dbConn dbConn
 * @param args user
 * @returns created user
 */
export const createUser = async (dbConn, username, payload: object) => {
 return (await UserModel(dbConn).create({username: username, payload: payload}));
}

/**
 * deletes user
 * @param dbConn dbConn
 * @returns deleted user or null
 */
export const deleteUser = async (dbConn, username) => {
 return UserModel(dbConn).findOneAndDelete({username: username});
}

/**
 * updates user
 * @param dbConn dbConn
 * @param args user
 * @returns updated user or null
 */
export const updateUser = async (dbConn, username, payload: object) => {
 return UserModel(dbConn).findOneAndUpdate({username: username}, {payload: payload}, {new: true});
}

/**
 * search users by username prefix
 * @param dbConn dbConn
 * @returns users or null
 */
export const search = async (dbConn, prefix, limit?: number) => {
 if (!limit) {
  limit = 10;
 }
 return UserModel(dbConn).find({username: {'$regex': prefix, '$options': 'i'}}, null, {limit}).select('username -_id');
}
