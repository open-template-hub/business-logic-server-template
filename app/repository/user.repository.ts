/**
 * @description holds user repository
 */

import { UserDataModel } from '../data/user.data';
import { User } from '../interface/user.interface';

export class UserRepository {
  private dataModel: any = null;

  /**
   * initializes repository
   * @param connection db connection
   */
  initialize = async ( connection: any ) => {
    this.dataModel = await new UserDataModel().getDataModel( connection );
    return this;
  };

  /**
   * gets all users
   * @returns user list
   */
  getAllUsers = async () => {
    try {
      let list = await this.dataModel.find();
      if ( list != null ) {
        list = list.map( ( u: User ) => {
          return u;
        } );
      }
      return list;
    } catch ( error ) {
      console.error( '> getAllUsers error: ', error );
      throw error;
    }
  };

  /**
   * gets user by username
   * @param username username
   * @returns user
   */
  getUserByUsername = async ( username: string ) => {
    try {
      return await this.dataModel.findOne( { username } );
    } catch ( error ) {
      console.error( '> getUserByUsername error: ', error );
      throw error;
    }
  };

  /**
   * creates user
   * @param user user
   * @returns user
   */
  createUser = async ( user: User ) => {
    try {
      return await this.dataModel.create( {
        username: user.username,
        payload: user.payload,
      } );
    } catch ( error ) {
      console.error( '> createUser error: ', error );
      throw error;
    }
  };

  /**
   * deletes user by username
   * @param username username
   * @returns deleted user
   */
  deleteUserByUsername = async ( username: string ) => {
    try {
      return await this.dataModel.findOneAndDelete( { username } );
    } catch ( error ) {
      console.error( '> deleteUserByUsername error: ', error );
      throw error;
    }
  };

  /**
   * updates user
   * @param user user
   * @returns updated user
   */
  updateUser = async ( user: User ) => {
    try {
      return await this.dataModel.findOneAndUpdate(
          { username: user.username },
          { payload: user.payload },
          { new: true }
      );
    } catch ( error ) {
      console.error( '> updateUser error: ', error );
      throw error;
    }
  };

  /**
   * searches users by prefix
   * @param prefix prefix
   * @param limit limit
   * @returns user list
   */
  searchUser = async ( prefix: string, limit: number ) => {
    try {
      return await this.dataModel
      .find( { username: { $regex: prefix, $options: 'i' } }, null, { limit } )
      .select( 'username -_id' );
    } catch ( error ) {
      console.error( '> searchUser error: ', error );
      throw error;
    }
  };
}
