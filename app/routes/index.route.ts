import { router as monitorRouter, publicRoutes as monitorPublicRoutes } from './monitor.route';
import { router as userRouter, publicRoutes as userPublicRoutes } from './user.route';
import productRouter from './product.route';
import { Request, Response } from 'express';
import { context } from '../context';
import { handle } from '../services/error-handler.service';
import { EncryptionService } from '../services/encryption.service';
import { MongoDbProvider } from '../providers/mongodb.provider';
import { preload } from '../services/preload.service';

// debug logger
const debugLog = require('debug')('basic-server:' + __filename.slice(__dirname.length + 1));

const subRoutes = {
  root: '/',
  monitor: '/monitor',
  user: '/user',
  product: '/product'
}

const publicRoutes: string[] = [];

export module Routes {
  const mongoDbProvider = new MongoDbProvider();

  export const mount = (app: any) => {
    preload(mongoDbProvider).then(() => console.log('DB preload is completed.'));

    for (const route of monitorPublicRoutes) {
      publicRoutes.push(subRoutes.monitor + route);
    }

    for (const route of userPublicRoutes) {
      publicRoutes.push(subRoutes.user + route);
    }

    const responseInterceptor = (req, res, next) => {
      let originalSend = res.send;
      const service = new EncryptionService();
      res.send = function () {
        debugLog("Starting Encryption: ", new Date());
        let encrypted_arguments = service.encrypt(arguments);
        debugLog("Encryption Completed: ", new Date());

        originalSend.apply(res, encrypted_arguments);
      };

      next();
    }

    // Use this interceptor before routes
    app.use(responseInterceptor);

    // INFO: Keep this method at top at all times
    app.all('/*', async (req: Request, res: Response, next) => {
      try {
        // create context
        res.locals.ctx = await context(req, mongoDbProvider, publicRoutes);

        next();
      } catch (err) {
        let error = handle(err);
        res.status(error.code).json({message: error.message});
      }
    });

    // INFO: Add your routes here
    app.use(subRoutes.monitor, monitorRouter);
    app.use(subRoutes.user, userRouter);
    app.use(subRoutes.product, productRouter);

    // Use for error handling
    app.use(function (err, req, res, next) {
      let error = handle(err);
      res.status(error.code).json({ message: error.message });
    });
  }
}

