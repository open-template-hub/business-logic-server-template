/**
 * @description holds user routes
 */

import Router from 'express-promise-router';
import { Request, Response } from 'express';
import { createUser, deleteUser, getAllUsers, getUser, search, updateUser } from '../services/user.service';
import { ResponseCode } from '../util/constant';
import { getAdmin } from '../services/auth.service';

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

const maxLimit = 1000;

// User detail
router.get(subRoutes.public, async (req: Request, res: Response) => {
 // Get a single User detail
 const dbConn = res.locals.ctx.mongoDbProvider?.getConnection();
 let user = await getUser(dbConn, req.query.username);
 res.status(ResponseCode.OK).json(user);
});

// Search Usernames with Prefix
router.get(subRoutes.search, async (req: Request, res: Response) => {
 const dbConn = res.locals.ctx.mongoDbProvider?.getConnection();
 if (!req.query.q || !req.query.q.toString() || req.query.q.toString().length < 3) {
  res.status(ResponseCode.OK).send();
 }

 let limit = 10;
 if (req.query.limit) {
  limit = parseInt(req.query.limit.toString());
 }
 let users = await search(dbConn, req.query.q, limit > maxLimit ? maxLimit : limit);
 res.status(ResponseCode.OK).json(users);
});

router.get(subRoutes.all, async (req: Request, res: Response) => {
 // GET endpoint to get all users, this is for admin usage,
 // you should add admin rights on context level
 await getAdmin(req);
 const dbConn = res.locals.ctx.mongoDbProvider?.getConnection();
 let users = await getAllUsers(dbConn);
 res.status(ResponseCode.OK).json(users);
});

// User detail
router.get(subRoutes.root, async (req: Request, res: Response) => {
 // Get a single User detail
 const dbConn = res.locals.ctx.mongoDbProvider?.getConnection();
 let user = await getUser(dbConn, req.query.username);
 res.status(ResponseCode.OK).json(user);
});

router.post(subRoutes.root, async (req: Request, res: Response) => {
 // Create new User
 const dbConn = res.locals.ctx.mongoDbProvider?.getConnection();
 let user = await createUser(dbConn, req.body.username, req.body.payload);
 res.status(ResponseCode.CREATED).json(user);
});

router.put(subRoutes.root, async (req: Request, res: Response) => {
 // Update a User
 const dbConn = res.locals.ctx.mongoDbProvider?.getConnection();
 let user = await updateUser(dbConn, req.body.username, req.body.payload);
 res.status(ResponseCode.OK).json(user);
});

router.delete(subRoutes.root, async (req: Request, res: Response) => {
 // Delete a User
 const dbConn = res.locals.ctx.mongoDbProvider?.getConnection();
 let user = await deleteUser(dbConn, req.query.username);
 res.status(ResponseCode.OK).json(user);
});

// Me - Special case of User (gets the user info from access token)
router.get(subRoutes.me, async (req: Request, res: Response) => {
 // Get a single User detail
 const dbConn = res.locals.ctx.mongoDbProvider?.getConnection();
 let user = await getUser(dbConn, res.locals.ctx.currentUser.username);
 res.status(ResponseCode.OK).json(user);
});

router.post(subRoutes.me, async (req: Request, res: Response) => {
 // Create new User
 const dbConn = res.locals.ctx.mongoDbProvider?.getConnection();
 let user = await createUser(dbConn, res.locals.ctx.currentUser.username, req.body.payload);
 res.status(ResponseCode.CREATED).json(user);
});

router.put(subRoutes.me, async (req: Request, res: Response) => {
 // Update a User
 const dbConn = res.locals.ctx.mongoDbProvider?.getConnection();
 let user = await updateUser(dbConn, res.locals.ctx.currentUser.username, req.body.payload);
 res.status(ResponseCode.OK).json(user);
});

router.delete(subRoutes.me, async (req: Request, res: Response) => {
 // Delete a User
 const dbConn = res.locals.ctx.mongoDbProvider?.getConnection();
 let user = await deleteUser(dbConn, res.locals.ctx.currentUser.username);
 res.status(ResponseCode.OK).json(user);
});
