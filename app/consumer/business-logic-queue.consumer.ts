import {
  BusinessLogicActionType,
  ContextArgs,
  MessageQueueProvider,
  MongoDbProvider,
  NotificationParams,
  QueueConsumer,
} from '@open-template-hub/common';
import { NotificationController } from '../controller/notification.controller';

export class BusinessLogicQueueConsumer implements QueueConsumer {
  private channel: any;
  private ctxArgs: ContextArgs = {} as ContextArgs;

  constructor( private notificationController = new NotificationController() ) {
  }

  init = ( channel: string, ctxArgs: ContextArgs ) => {
    this.channel = channel;
    this.ctxArgs = ctxArgs;
    return this;
  };

  onMessage = async ( msg: any ) => {
    if ( msg !== null ) {
      const msgStr = msg.content.toString();
      const msgObj = JSON.parse( msgStr );

      const message: BusinessLogicActionType = msgObj.message;

      // Decide requeue in the error handling
      let requeue = false;

      let params: NotificationParams;

      if ( message?.notification?.params?.username && message?.notification?.params?.message && message?.notification?.params?.timestamp ) {

        params = message.notification.params;

        let hook = async () => {
          await this.notificationController.createNotification(
              this.ctxArgs.mongodb_provider as MongoDbProvider,
              this.ctxArgs.message_queue_provider as MessageQueueProvider,
              {
                username: params.username,
                message: params.message,
                timestamp: params.timestamp
              } );
        };

        await this.operate( msg, msgObj, requeue, hook );
      } else {
        console.log( 'Message will be rejected: ', msgObj );
        this.channel.reject( msg, false );
        return;
      }
    }
  };

  private operate = async (
      msg: any,
      msgObj: any,
      requeue: boolean,
      hook: Function
  ) => {
    try {
      console.log(
          'Message Received with deliveryTag: ' + msg.fields.deliveryTag,
          msgObj
      );
      await hook();
      await this.channel.ack( msg );
      console.log(
          'Message Processed with deliveryTag: ' + msg.fields.deliveryTag,
          msgObj
      );
    } catch ( e ) {
      console.log(
          'Error with processing deliveryTag: ' + msg.fields.deliveryTag,
          msgObj,
          e
      );

      this.channel.nack( msg, false, requeue );
    }
  };
}
