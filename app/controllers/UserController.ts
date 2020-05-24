/**
 * @description holds crud operations for the user entity
 */

import UserModel from '../models/UserModel'

/**
 * gets all users if has admin rights
 * @param context context
 * @returns user list
 */
export const getAllUsers = async (context) => {
 let list;
 let connection = context.dbConn;
 if (context.currentUser.role === 'ADMIN') {
  try {
   list = await UserModel(connection).find();
   if (list != null && list.length > 0) {
    list = list.map(u => {
     return u
    });
   }
  } catch (error) {
   console.error('> getAllUsers error: ', error);
   throw new Error('Error retrieving all users');
  }
 } else {
  throw new Error('You do not have desired permission for this operation.');
 }

 return list;
}

/**
 * gets user by id
 * @param context context
 * @returns user or null
 */
export const getUser = async (context, username) => {
 let user;
 let connection = context.dbConn;
 try {
  user = await UserModel(connection).findOne({username: username});
 } catch (error) {
  console.error('> getUser error: ', error);
  throw error;
 }

 return user;
}

/**
 * creates user
 * @param context context
 * @param args user
 * @returns created user
 */
export const createUser = async (context, username, payload: object) => {
 let createdUser;
 let connection = context.dbConn;
 try {
  createdUser = (await UserModel(connection).create({username: username, payload: payload}));
 } catch (error) {
  console.error('> createUser error: ', error);
  throw error;
 }

 return createdUser;
}

/**
 * deletes user
 * @param context context
 * @returns deleted user or null
 */
export const deleteUser = async (context, username) => {
 let deletedUser;
 let connection = context.dbConn;
 try {
  deletedUser = await UserModel(connection).findOneAndDelete({username: username});
 } catch (error) {
  console.error('> deleteUser error: ', error);
  throw error;
 }

 return deletedUser;
}

/**
 * updates user
 * @param context context
 * @param args user
 * @returns updated user or null
 */
export const updateUser = async (context, username, payload: object) => {
 let updatedUser;
 let connection = context.dbConn;
 try {
  updatedUser = await UserModel(connection).findOneAndUpdate({username: username},
   {
    payload: payload
   }, {new: true});
 } catch (error) {
  console.error('> updateUser error: ', error);
  throw error;
 }

 return updatedUser;
}
