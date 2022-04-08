/**
 * @description holds index routes
 */

import {
  ContextArgs,
  MountArgs,
  MountAssets,
  Route,
  RouteArgs,
  mount as mountApp,
} from '@open-template-hub/common';
import { Environment } from '../../environment';
import { BusinessLogicQueueConsumer } from '../consumer/business-logic-queue.consumer';
import { router as monitorRouter } from './monitor.route';
import { router as productRouter } from './product.route';
import { router as userRouter } from './user.route';
import { router as notificationRouter } from './notification.route';

const subRoutes = {
  root: '/',
  monitor: '/monitor',
  user: '/user',
  product: '/product',
  notification: '/notification'
};

export namespace Routes {
  export const mount = (app: any) => {
    const envArgs = new Environment().args();

    const ctxArgs = {
      envArgs,
      providerAvailability: {
        mongo_enabled: true,
        postgre_enabled: false,
        mq_enabled: true,
      },
    } as ContextArgs;

    const assets = {
      mqChannelTag: envArgs.mqArgs
        ?.businessLogicServerMessageQueueChannel as string,
      queueConsumer: new BusinessLogicQueueConsumer(),
      applicationName: 'BusinessLogicServer',
    } as MountAssets;

    var routes: Array<Route> = [];

    routes.push({ name: subRoutes.monitor, router: monitorRouter });
    routes.push( { name: subRoutes.user, router: userRouter } );
    routes.push({ name: subRoutes.product, router: productRouter });
    routes.push({ name: subRoutes.notification, router: notificationRouter });

    const routeArgs = { routes } as RouteArgs;

    const args = {
      app,
      ctxArgs,
      routeArgs,
      assets,
    } as MountArgs;

    mountApp(args);
  };
}
