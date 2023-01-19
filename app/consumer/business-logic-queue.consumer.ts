import {
  AbstractQueueConsumer,
  BusinessLogicActionType,
  ContextArgs,
  MessageQueueChannelType,
  MessageQueueProvider,
  MongoDbProvider,
  NotificationParams,
  QueueConsumer,
} from '@open-template-hub/common';
import { NotificationController } from '../controller/notification.controller';

export class BusinessLogicQueueConsumer
  extends AbstractQueueConsumer
  implements QueueConsumer
{
  private notificationController: NotificationController;

  constructor() {
    super();
    this.notificationController = new NotificationController();
    this.ownerChannelType = MessageQueueChannelType.BUSINESS_LOGIC;
  }

  init = (channel: string, ctxArgs: ContextArgs) => {
    this.channel = channel;
    this.ctxArgs = ctxArgs;
    return this;
  };

  onMessage = async (msg: any) => {
    if (msg !== null) {
      const msgStr = msg.content.toString();
      const msgObj = JSON.parse(msgStr);

      const message: BusinessLogicActionType = msgObj.message;

      // Decide requeue in the error handling
      let requeue = false;

      let params: NotificationParams;

      if (
        message?.notification?.params?.username &&
        message?.notification?.params?.message &&
        message?.notification?.params?.timestamp
      ) {
        params = message.notification.params;

        let hook = async () => {
          await this.notificationController.createNotification(
            this.ctxArgs.mongodb_provider as MongoDbProvider,
            this.ctxArgs.message_queue_provider as MessageQueueProvider,
            {
              username: params.username,
              message: params.message,
              timestamp: params.timestamp,
              sender: params.sender,
              category: params.category,
              image: params.image,
              payload: params.payload,
            }
          );
        };

        await this.operate(msg, msgObj, requeue, hook);
      } else {
        console.log('Message will be rejected: ', msgObj);
        this.channel.reject(msg, false);
        return;
      }
    }
  };
}
