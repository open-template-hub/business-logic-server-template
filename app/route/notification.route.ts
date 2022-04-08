/**
 * @description holds notification routes
 */

import { authorizedBy, ResponseCode, UserRole, } from '@open-template-hub/common';
import { Request, Response } from 'express';
import Router from 'express-promise-router';
import { NotificationController } from '../controller/notification.controller';

const subRoutes = {
  root: '/',
  me: '/me',
};

export const router = Router();

router.get( subRoutes.me, authorizedBy( [ UserRole.ADMIN, UserRole.DEFAULT ] ),
    async ( req: Request, res: Response ) => {
      const context = res.locals.ctx;

      // Get my notifications
      const notificationController = new NotificationController();

      const notifications = await notificationController.getNotifications( context, context.username );
      res.status( ResponseCode.OK ).json( notifications );
    }
);

router.put(
    subRoutes.me,
    authorizedBy( [ UserRole.ADMIN, UserRole.DEFAULT ] ),
    async ( req: Request, res: Response ) => {
      // Update a Notification
      const notificationController = new NotificationController();

      const context = res.locals.ctx;
      let notification = await notificationController.updateNotification( context, req.body.id, req.body.read );
      res.status( ResponseCode.OK ).json( notification );
    }
);
