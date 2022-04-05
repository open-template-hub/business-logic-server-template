/**
 * @description holds product repository
 */

import { NotificationDataModel } from '../data/notification.data';

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
      return await this.dataModel.find( { username } );
    } catch ( error ) {
      console.error( '> getNotificationsByUsername error: ', error );
      throw error;
    }
  };
}
