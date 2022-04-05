/**
 * @description holds notification controller
 */

import { Context } from '@open-template-hub/common';
import { NotificationRepository } from '../repository/notification.repository';

export class NotificationController {

  /**
   * gets notifications by username
   * @param context
   * @param username
   * @returns product or null
   */
  getNotifications = async ( context: Context, username: string ) => {
    const notificationRepository = await new NotificationRepository().initialize(
        context.mongodb_provider.getConnection()
    );

    return notificationRepository.getNotificationsByUsername( username );
  };
}
