/**
 * @description holds product repository
 */

import { NotificationDataModel } from '../data/notification.data';
import { Notification } from '../interface/notification.interface';

export class NotificationRepository {
  private dataModel: any = null;

  /**
   * initializes repository
   * @param connection db connection
   */
  initialize = async ( connection: any ) => {
    this.dataModel = await new NotificationDataModel().getDataModel( connection );
    return this;
  };

  /**
   * gets notifications by username
   * @param username username
   * @returns product
   */
  getNotificationsByUsername = async ( username: string ) => {
    try {
      return await this.dataModel.find( { username } ).sort({timestamp: -1});
    } catch ( error ) {
      console.error( '> getNotificationsByUsername error: ', error );
      throw error;
    }
  };

  /**
   * creates notification
   * @param notification notification
   * @returns notification
   */
  createNotification = async ( notification: Notification ) => {
    try {
      return await this.dataModel.create( notification );
    } catch ( error ) {
      console.error( '> createNotification error: ', error );
      throw error;
    }
  };

  /**
   * updates notification
   * @param id id
   * @param username username
   * @param read read
   * @returns updated notification
   */
  updateNotification = async ( id: any, username: string, read: boolean ) => {
    try {
      const a = await this.dataModel.findOne( { username, _id: id } );
      return await this.dataModel.findOneAndUpdate(
          { username, _id: id },
          { read },
          { new: true }
      );
    } catch ( error ) {
      console.error( '> updateNotification error: ', error );
      throw error;
    }
  };
}
