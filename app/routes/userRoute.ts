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
 try {
  // GET endpoint to get all users, this is for admin usage,
  // you should add admin rights on context level
  let users = await getAllUsers(res.locals.ctx.dbConn, res.locals.ctx.currentUser);
  res.status(ResponseCode.OK).send(users);
 } catch (e) {
  res.status(ResponseCode.BAD_REQUEST).send({message: e.message});
 }
});

// User detail
router.get(subRoutes.root, async (req: Request, res: Response) => {
 // Get a single User detail
 try {
  let user = await getUser(res.locals.ctx.dbConn, req.query.username);
  res.status(ResponseCode.OK).send(user);
 } catch (e) {
  res.status(ResponseCode.BAD_REQUEST).send({message: e.message});
 }
});

router.post(subRoutes.root, async (req: Request, res: Response) => {
 // Create new User
 try {
  let user = await createUser(res.locals.ctx.dbConn, req.body.username, req.body.payload);
  res.status(ResponseCode.CREATED).send(user);
 } catch (e) {
  res.status(ResponseCode.BAD_REQUEST).send({message: e.message});
 }
});

router.put(subRoutes.root, async (req: Request, res: Response) => {
 // Update a User
 try {
  let user = await updateUser(res.locals.ctx.dbConn, req.body.username, req.body.payload);
  res.status(ResponseCode.OK).send(user);
 } catch (e) {
  res.status(ResponseCode.BAD_REQUEST).send({message: e.message});
 }
});

router.delete(subRoutes.root, async (req: Request, res: Response) => {
 // Delete a User
 try {
  let user = await deleteUser(res.locals.ctx.dbConn, req.query.username);
  res.status(ResponseCode.OK).send(user);
 } catch (e) {
  res.status(ResponseCode.BAD_REQUEST).send({message: e.message});
 }
});

// Me - Special case of User (gets the user info from access token)
router.get(subRoutes.me, async (req: Request, res: Response) => {
 // Get a single User detail
 try {
  let user = await getUser(res.locals.ctx.dbConn, res.locals.ctx.currentUser.username);
  res.status(ResponseCode.OK).send(user);
 } catch (e) {
  res.status(ResponseCode.BAD_REQUEST).send({message: e.message});
 }
});

router.post(subRoutes.me, async (req: Request, res: Response) => {
 // Create new User
 try {
  let user = await createUser(res.locals.ctx.dbConn, res.locals.ctx.currentUser.username, req.body.payload);
  res.status(ResponseCode.CREATED).send(user);
 } catch (e) {
  res.status(ResponseCode.BAD_REQUEST).send({message: e.message});
 }
});

router.put(subRoutes.me, async (req: Request, res: Response) => {
 // Update a User
 try {
  let user = await updateUser(res.locals.ctx.dbConn, res.locals.ctx.currentUser.username, req.body.payload);
  res.status(ResponseCode.OK).send(user);
 } catch (e) {
  res.status(ResponseCode.BAD_REQUEST).send({message: e.message});
 }
});

router.delete(subRoutes.me, async (req: Request, res: Response) => {
 // Delete a User
 try {
  let user = await deleteUser(res.locals.ctx.dbConn, res.locals.ctx.currentUser.username);
  res.status(ResponseCode.OK).send(user);
 } catch (e) {
  res.status(ResponseCode.BAD_REQUEST).send({message: e.message});
 }
});

export = router;
