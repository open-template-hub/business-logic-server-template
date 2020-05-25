/**
 * @description holds user routes
 */

import Router from 'express-promise-router';
import { Request, Response } from 'express';
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from '../controllers/UserController';
import { ResponseCode } from '../models/Constant';

const subRoutes = {
 root: '/',
 all: '/all',
 me: '/me'
}

const router = Router();

router.get(subRoutes.all, async (req: Request, res: Response) => {
  // GET endpoint to get all users, this is for admin usage,
  // you should add admin rights on context level
  let users = await getAllUsers(res.locals.ctx.dbConn, res.locals.ctx.currentUser);
  res.status(ResponseCode.OK).send(users);
});

// User detail
router.get(subRoutes.root, async (req: Request, res: Response) => {
 // Get a single User detail
  let user = await getUser(res.locals.ctx.dbConn, req.query.username);
  res.status(ResponseCode.OK).send(user);
});

router.post(subRoutes.root, async (req: Request, res: Response) => {
 // Create new User
  let user = await createUser(res.locals.ctx.dbConn, req.body.username, req.body.payload);
  res.status(ResponseCode.CREATED).send(user);
});

router.put(subRoutes.root, async (req: Request, res: Response) => {
 // Update a User
  let user = await updateUser(res.locals.ctx.dbConn, req.body.username, req.body.payload);
  res.status(ResponseCode.OK).send(user);
});

router.delete(subRoutes.root, async (req: Request, res: Response) => {
 // Delete a User
  let user = await deleteUser(res.locals.ctx.dbConn, req.query.username);
  res.status(ResponseCode.OK).send(user);
});

// Me - Special case of User (gets the user info from access token)
router.get(subRoutes.me, async (req: Request, res: Response) => {
 // Get a single User detail
  let user = await getUser(res.locals.ctx.dbConn, res.locals.ctx.currentUser.username);
  res.status(ResponseCode.OK).send(user);
});

router.post(subRoutes.me, async (req: Request, res: Response) => {
 // Create new User
  let user = await createUser(res.locals.ctx.dbConn, res.locals.ctx.currentUser.username, req.body.payload);
  res.status(ResponseCode.CREATED).send(user);
});

router.put(subRoutes.me, async (req: Request, res: Response) => {
 // Update a User
  let user = await updateUser(res.locals.ctx.dbConn, res.locals.ctx.currentUser.username, req.body.payload);
  res.status(ResponseCode.OK).send(user);
});

router.delete(subRoutes.me, async (req: Request, res: Response) => {
 // Delete a User
  let user = await deleteUser(res.locals.ctx.dbConn, res.locals.ctx.currentUser.username);
  res.status(ResponseCode.OK).send(user);
});

export = router;
