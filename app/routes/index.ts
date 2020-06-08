import userRouter from './userRoute';
import productRouter from './productRoute';
import { Request, Response } from 'express';
import { context } from '../context';
import { handle } from '../services/errorHandler';
import { EncryptionService } from '../services/encryptionService';

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

    // use this interceptor before routes
    app.use(responseInterceptor);


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

    app.use('/user', userRouter);
    app.use('/product', productRouter);

    // Use for error handling
    app.use(function (err, req, res, next) {
      let error = handle(err);
      console.log(err);
      res.status(error.code).json({ message: error.message });
    });

  }
}

