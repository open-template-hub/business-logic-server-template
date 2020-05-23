/**
 * @description holds crud operations for the user entity 
 */

import UserModel from "../models/UserModel"

/**
 * gets all users if has admin rights
 * @param context context
 * @returns user list
 */
export const getAllUsers = async (context) => { 
  let list;
  let connection = context.dbConn;
  if (context.hasAdminRight) {
    try {
      list = await UserModel(connection).find();
      if (list != null && list.length > 0) {
        list = list.map(u => {
          return u
        }); 
      }
    } catch(error) {
      console.error("> getAllUsers error: ", error);
      throw new Error("Error retrieving all users");
    }
  } else {
    throw new Error("You do not have desired permission for this operation.");
  }

  return list;
}

/**
 * gets user by id
 * @param context context
 * @returns user or null
 */
export const getUser = async (context) => {
  let user;
  let username = context.currentUser.username;
  let connection = context.dbConn;
  try {
    user = await UserModel(connection).findOne({username: username});
  } catch(error) {
    console.error("> getUser error: ", error);
    throw new Error("Error retrieving user with username: " + username);
  }

  return user;
}

/**
 * creates user
 * @param context context
 * @param args user
 * @returns created user
 */
export const createUser = async (context, payload: object) => {
  let createdUser;
  let username = context.currentUser.username;
  let connection = context.dbConn;
  try {
    createdUser = (await UserModel(connection).create({username: username, payload: payload}));
  } catch(error) {
    console.error("> createUser error: ", error);
    throw new Error("Error saving user with username: " + username);
  }

  return createdUser;
}

/**
 * deletes user
 * @param context context
 * @returns deleted user or null
 */
export const deleteUser = async (context) => {
  let deletedUser;
  let username = context.currentUser.username;
  let connection = context.dbConn;
  try {
    deletedUser = await UserModel(connection).findOneAndDelete({username: username});
  } catch(error) {
    console.error("> deleteUser error: ", error);
    throw new Error("Error deleting user with username: " + username);
  }

  return deletedUser;
}

/**
 * updates user
 * @param context context
 * @param args user
 * @returns updated user or null
 */
export const updateUser = async (context, payload: object) => {
  let updatedUser;
  let username = context.currentUser.username;
  let connection = context.dbConn;
  try {
    updatedUser = await UserModel(connection).findOneAndUpdate({username: username}, 
      {
        payload: payload
      }, {new: true});
  } catch(error) {
    console.error("> updateUser error: ", error);
    throw new Error("Error updating user with username: " + username);
  }

  return updatedUser;
}