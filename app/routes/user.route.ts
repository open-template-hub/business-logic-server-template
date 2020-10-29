/**
 * @description holds user routes
 */

import Router from 'express-promise-router';
import { Request, Response } from 'express';
import { ResponseCode } from '../util/constant';
import { getAdmin } from '../services/auth.service';
import {UserController} from "../controllers/user.controller";
import {User} from "../models/user.model";

const subRoutes = {
 root: '/',
 all: '/all',
 me: '/me',
 search: '/search',
 public: '/public'
}

export const publicRoutes = [
 subRoutes.search,
 subRoutes.public
];

export const router = Router();

const userController = new UserController();

const maxLimit = 1000;

// User detail
router.get(subRoutes.public, async (req: Request, res: Response) => {
 // Get a single User detail
 let user = await userController.getUser(res.locals.ctx, req.query.username);
 res.status(ResponseCode.OK).json(user);
});

// Search Usernames with Prefix
router.get(subRoutes.search, async (req: Request, res: Response) => {
 if (!req.query.q || !req.query.q.toString() || req.query.q.toString().length < 3) {
  res.status(ResponseCode.OK).send();
 }

 let limit = 10;
 if (req.query.limit) {
  limit = parseInt(req.query.limit.toString());
 }
 let users = await userController.search(res.locals.ctx, req.query.q, limit > maxLimit ? maxLimit : limit);
 res.status(ResponseCode.OK).json(users);
});

router.get(subRoutes.all, async (req: Request, res: Response) => {
 // GET endpoint to get all users, this is for admin usage,
 // you should add admin rights on context level
 await getAdmin(req);
 let users = await userController.getAllUsers(res.locals.ctx);
 res.status(ResponseCode.OK).json(users);
});

// User detail
router.get(subRoutes.root, async (req: Request, res: Response) => {
 // Get a single User detail
 let user = await userController.getUser(res.locals.ctx, req.query.username);
 res.status(ResponseCode.OK).json(user);
});

router.post(subRoutes.root, async (req: Request, res: Response) => {
 // Create new User
 let user = await userController.createUser(res.locals.ctx, {username: req.body.username, payload: req.body.payload} as User);
 res.status(ResponseCode.CREATED).json(user);
});

router.put(subRoutes.root, async (req: Request, res: Response) => {
 // Update a User
 let user = await userController.updateUser(res.locals.ctx,
     {username: req.body.username, payload: req.body.payload} as User);
 res.status(ResponseCode.OK).json(user);
});

router.delete(subRoutes.root, async (req: Request, res: Response) => {
 // Delete a User
 let user = await userController.deleteUser(res.locals.ctx, req.query.username);
 res.status(ResponseCode.OK).json(user);
});

// Me - Special case of User (gets the user info from access token)
router.get(subRoutes.me, async (req: Request, res: Response) => {
 // Get a single User detail
 let user = await userController.getUser(res.locals.ctx, res.locals.ctx.currentUser.username);
 res.status(ResponseCode.OK).json(user);
});

router.post(subRoutes.me, async (req: Request, res: Response) => {
 // Create new User
 let user = await userController.createUser(res.locals.ctx,
     {username: res.locals.ctx.currentUser.username, payload: req.body.payload} as User);
 res.status(ResponseCode.CREATED).json(user);
});

router.put(subRoutes.me, async (req: Request, res: Response) => {
 // Update a User
 let user = await userController.updateUser(res.locals.ctx,
     {username: res.locals.ctx.currentUser.username, payload: req.body.payload} as User);
 res.status(ResponseCode.OK).json(user);
});

router.delete(subRoutes.me, async (req: Request, res: Response) => {
 // Delete a User
 let user = await userController.deleteUser(res.locals.ctx, res.locals.ctx.currentUser.username);
 res.status(ResponseCode.OK).json(user);
});
