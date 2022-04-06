/**
 * @description holds notification controller
 */

import {
  Context,
  MessageQueueChannelType,
  MessageQueueProvider,
  MongoDbProvider,
  NotificationParams,
  OrchestrationActionType,
  QueueMessage
} from '@open-template-hub/common';
import { Environment } from '../../environment';
import { Notification } from '../interface/notification.interface';
import { NotificationRepository } from '../repository/notification.repository';

export class NotificationController {

  constructor(
      private environment = new Environment()
  ) {
    // intentionally blank
  }

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

  /**
   * creates notification
   * @param mongodb_provider
   * @param message_queue_provider
   * @param notification notification
   * @returns created notification
   */
  createNotification = async ( mongodb_provider: MongoDbProvider, message_queue_provider: MessageQueueProvider, notification: Notification ) => {
    const notificationRepository = await new NotificationRepository().initialize(
        mongodb_provider.getConnection()
    );

    const response = notificationRepository.createNotification( notification );

    await this.sendNotificationToQueue( message_queue_provider, notification );

    return response;
  };

  /**
   * updates notification
   * @param context context
   * @param id id
   *@param read read
   * @returns updated notification or null
   */
  updateNotification = async ( context: Context, id: any, read: boolean ) => {
    const notificationRepository = await new NotificationRepository().initialize(
        context.mongodb_provider.getConnection()
    );

    return notificationRepository.updateNotification( id, context.username, read );
  };

  private async sendNotificationToQueue(
      messageQueueProvider: MessageQueueProvider,
      notification: Notification
  ) {
    const orchestrationChannelTag =
        this.environment.args().mqArgs?.orchestrationServerMessageQueueChannel;

    const notificationParams = {
      timestamp: notification.timestamp,
      username: notification.username,
      message: notification.message
    } as NotificationParams;

    const message = {
      sender: MessageQueueChannelType.BUSINESS_LOGIC,
      receiver: MessageQueueChannelType.ORCHESTRATION,
      message: {
        pushNotification: {
          params: notificationParams
        },
      } as OrchestrationActionType,
    } as QueueMessage;

    await messageQueueProvider.publish(
        message,
        orchestrationChannelTag as string
    );
  }
}
