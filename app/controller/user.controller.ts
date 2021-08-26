/**
 * @description holds user controller
 */

import { Context } from '@open-template-hub/common';
import { User } from '../interface/user.interface';
import { UserRepository } from '../repository/user.repository';

export class UserController {
  /**
   * gets all users
   * @param context context
   * @returns user list
   */
  getAllUsers = async ( context: Context ) => {
    const userRepository = await new UserRepository().initialize(
        context.mongodb_provider.getConnection()
    );

    return await userRepository.getAllUsers();
  };

  /**
   * gets user by id
   * @param context context
   * @param username username
   * @returns user or null
   */
  getUser = async ( context: Context, username: string ) => {
    const userRepository = await new UserRepository().initialize(
        context.mongodb_provider.getConnection()
    );

    return await userRepository.getUserByUsername( username );
  };

  /**
   * creates user
   * @param context context
   * @param user user
   * @returns created user
   */
  createUser = async ( context: Context, user: User ) => {
    console.log( '> CreateUser:: Username: ', user.username );
    const userRepository = await new UserRepository().initialize(
        context.mongodb_provider.getConnection()
    );

    return await userRepository.createUser( user );
  };

  /**
   * deletes user
   * @param context context
   * @param username username
   * @returns deleted user or null
   */
  deleteUser = async ( context: Context, username: string ) => {
    const userRepository = await new UserRepository().initialize(
        context.mongodb_provider.getConnection()
    );

    return await userRepository.deleteUserByUsername( username );
  };

  /**
   * updates user
   * @param context context
   * @param user user
   * @returns updated user or null
   */
  updateUser = async ( context: Context, user: User ) => {
    const userRepository = await new UserRepository().initialize(
        context.mongodb_provider.getConnection()
    );

    return await userRepository.updateUser( user );
  };

  /**
   * search users by username prefix
   * @param context context
   * @param prefix prefix
   * @param limit limit
   * @returns users or null
   */
  search = async ( context: Context, prefix: string, limit?: number ) => {
    const userRepository = await new UserRepository().initialize(
        context.mongodb_provider.getConnection()
    );

    if ( !limit ) {
      limit = 10;
    }

    return await userRepository.searchUser( prefix, limit );
  };
}
