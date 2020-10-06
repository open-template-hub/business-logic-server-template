import monitorRouter from './monitor.route';
import userRouter from './user.route';
import productRouter from './product.route';
import { Request, Response } from 'express';
import { context } from '../context';
import { handle } from '../services/error-handler.service';
import { EncryptionService } from '../services/encryption.service';

const subRoutes = {
  root: '/',
  monitor: '/monitor',
  user: '/user',
  product: '/product',
}

export module Routes {
  export function mount(app) {

    const responseInterceptor = (req, res, next) => {
      var originalSend = res.send;
      const service = new EncryptionService();
      res.send = function () {
        console.log("Starting Encryption: ", new Date());
        let encrypted_arguments = service.encrypt(arguments);
        console.log("Encryption Completed: ", new Date());

        originalSend.apply(res, encrypted_arguments);
      };

      next();
    }

    // Use this interceptor before routes
    app.use(responseInterceptor);

    // Monitor router should be called before context creation
    app.use(subRoutes.monitor, monitorRouter);

    // INFO: Keep this method at top at all times
    app.all('/*', async (req: Request, res: Response, next) => {
      try {
        // create context
        res.locals.ctx = await context(req);

        next();
      } catch (e) {
        let error = handle(e);
        res.status(error.code).json({ message: error.message });
      }
    });

    // INFO: Add your routes here
    app.use(subRoutes.user, userRouter);
    app.use(subRoutes.product, productRouter);

    // Use for error handling
    app.use(function (err, req, res, next) {
      let error = handle(err);
      console.log(err);
      res.status(error.code).json({ message: error.message });
    });
  }
}

