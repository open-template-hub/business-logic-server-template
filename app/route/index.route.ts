/**
 * @description holds index routes
 */

import {
  router as monitorRouter,
  publicRoutes as monitorPublicRoutes,
} from './monitor.route';
import {
  router as userRouter,
  publicRoutes as userPublicRoutes,
  adminRoutes as userAdminRoutes,
} from './user.route';
import {
  router as productRouter,
  adminRoutes as productAdminRoutes,
} from './product.route';
import { NextFunction, Request, Response } from 'express';
import { context } from '../context';
import { ErrorHandlerUtil } from '../util/error-handler.util';
import { EncryptionUtil } from '../util/encryption.util';
import { MongoDbProvider } from '../provider/mongo.provider';
import { PreloadUtil } from '../util/preload.util';
import { DebugLogUtil } from '../util/debug-log.util';

const subRoutes = {
  root: '/',
  monitor: '/monitor',
  user: '/user',
  product: '/product',
};

export module Routes {
  const mongodb_provider = new MongoDbProvider();
  const errorHandlerUtil = new ErrorHandlerUtil();
  const debugLogUtil = new DebugLogUtil();
  var publicRoutes: string[] = [];
  var adminRoutes: string[] = [];

  function populateRoutes(mainRoute: string, routes: Array<string>) {
    var populated = Array<string>();
    for (var i = 0; i < routes.length; i++) {
      const s = routes[i];
      populated.push(mainRoute + (s === '/' ? '' : s));
    }

    return populated;
  }

  export const mount = (app: any) => {
    const preloadUtil = new PreloadUtil();

    preloadUtil
      .preload(mongodb_provider)
      .then(() => console.log('DB preload is completed.'));

    publicRoutes = [
      ...populateRoutes(subRoutes.monitor, monitorPublicRoutes),
      ...populateRoutes(subRoutes.user, userPublicRoutes),
    ];
    console.log('Public Routes: ', publicRoutes);

    adminRoutes = [
      ...populateRoutes(subRoutes.product, productAdminRoutes),
      ...populateRoutes(subRoutes.user, userAdminRoutes),
    ];
    console.log('Admin Routes: ', adminRoutes);

    // create response interceptor
    const responseInterceptor = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      let originalSend = res.send;
      const encryptionUtil = new EncryptionUtil();
      res.send = function () {
        debugLogUtil.log('Starting Encryption: ', new Date());
        let encrypted_arguments = encryptionUtil.encrypt(arguments);
        debugLogUtil.log('Encryption Completed: ', new Date());

        originalSend.apply(res, encrypted_arguments as any);
      } as any;

      next();
    };

    // Use this interceptor before routes
    app.use(responseInterceptor);

    // INFO: Keep this method at top at all times
    app.all('/*', async (req: Request, res: Response, next: NextFunction) => {
      try {
        // create context
        res.locals.ctx = await context(
          req,
          mongodb_provider,
          publicRoutes,
          adminRoutes
        );

        next();
      } catch (err) {
        let error = errorHandlerUtil.handle(err);
        res.status(error.code).json({ message: error.message });
      }
    });

    // INFO: Add your routes here
    app.use(subRoutes.monitor, monitorRouter);
    app.use(subRoutes.user, userRouter);
    app.use(subRoutes.product, productRouter);

    // Use for error handling
    app.use(function (
      err: Error,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      let error = errorHandlerUtil.handle(err);
      res.status(error.code).json({ message: error.message });
    });
  };
}
