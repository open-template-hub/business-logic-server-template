import userRouter from './userRoute';
import { Request, Response } from 'express';
import { context } from '../context';
import { ResponseCode } from '../models/Constant';

export module Routes {
 export function mount(app) {

  // INFO: Keep this method at top at all times
  app.all('/*', async (req: Request, res: Response, next) => {
   try {
    // create context
    res.locals.ctx = await context(req);

    next();
   } catch (e) {
    res.status(e.responseCode ? e.responseCode : ResponseCode.INTERNAL_SERVER_ERROR).send(e.message);
   }
  });

  app.use('/user', userRouter);
 }
}

