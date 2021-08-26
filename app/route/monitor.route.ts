/**
 * @description holds monitor routes
 */

import { ResponseCode } from '@open-template-hub/common';
import { Request, Response } from 'express';
import Router from 'express-promise-router';

const subRoutes = {
  root: '/',
  alive: '/alive',
};

export const publicRoutes = [ subRoutes.alive ];

export const router = Router();

router.get( subRoutes.alive, async ( req: Request, res: Response ) => {
  // checks status is alive
  console.log("status check");
  res.status( ResponseCode.OK ).send();
} );
