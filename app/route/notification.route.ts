/**
 * @description holds product routes
 */

import { ResponseCode, } from '@open-template-hub/common';
import { Request, Response } from 'express';
import Router from 'express-promise-router';
import { NotificationController } from '../controller/notification.controller';

const subRoutes = {
  root: '/',
  me: '/me',
};

export const router = Router();

const notificationController = new NotificationController();

router.get( subRoutes.me, async ( req: Request, res: Response ) => {
  const context = res.locals.ctx;

  // Get my notifications
  const notifications = await notificationController.getNotifications( context, context.username );
  res.status( ResponseCode.OK ).json( notifications );
} );

