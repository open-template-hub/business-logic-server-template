/**
 * @description holds crud operations for the user entity
 */

import UserModel from '../models/UserModel'

/**
 * gets all users
 * @param dbConn dbConn
 * @returns user list
 */
export const getAllUsers = async (dbConn) => {
 let list;
  try {
   list = await UserModel(dbConn).find();
   if (list != null && list.length > 0) {
    list = list.map(u => {
     return u
    });
   }
  } catch (error) {
   console.error('> getAllUsers error: ', error);
   throw new Error('Error retrieving all users');
  }
 return list;
}

/**
 * gets user by id
 * @param dbConn dbConn
 * @returns user or null
 */
export const getUser = async (dbConn, username) => {
 let user;
 try {
  user = await UserModel(dbConn).findOne({username: username});
 } catch (error) {
  console.error('> getUser error: ', error);
  throw error;
 }

 return user;
}

/**
 * creates user
 * @param dbConn dbConn
 * @param args user
 * @returns created user
 */
export const createUser = async (dbConn, username, payload: object) => {
 let createdUser;
 try {
  createdUser = (await UserModel(dbConn).create({username: username, payload: payload}));
 } catch (error) {
  console.error('> createUser error: ', error);
  throw error;
 }

 return createdUser;
}

/**
 * deletes user
 * @param dbConn dbConn
 * @returns deleted user or null
 */
export const deleteUser = async (dbConn, username) => {
 let deletedUser;
 try {
  deletedUser = await UserModel(dbConn).findOneAndDelete({username: username});
 } catch (error) {
  console.error('> deleteUser error: ', error);
  throw error;
 }

 return deletedUser;
}

/**
 * updates user
 * @param dbConn dbConn
 * @param args user
 * @returns updated user or null
 */
export const updateUser = async (dbConn, username, payload: object) => {
 let updatedUser;
 try {
  updatedUser = await UserModel(dbConn).findOneAndUpdate({username: username},
   {
    payload: payload
   }, {new: true});
 } catch (error) {
  console.error('> updateUser error: ', error);
  throw error;
 }

 return updatedUser;
}
