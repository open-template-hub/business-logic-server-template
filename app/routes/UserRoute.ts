/**
 * @description holds user routes
 */

import { Request, Response } from 'express';
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from '../controllers/UserController';
import { ResponseCode } from '../models/Constant';

const userRoute = '/user';

export class UserRoute {
 public routes = (app, context): void => {
  // User
  app.route(userRoute + '/all')
   // GET endpoint to get all users, this is for admin usage,
   // you should add admin rights on context level
   .get(async (req: Request, res: Response) => {
    try {
     let users = await getAllUsers(context);
     res.status(ResponseCode.OK).send(users);
    } catch (e) {
     res.status(ResponseCode.BAD_REQUEST).send({message: e.message});
    }
   })

  // User detail
  app.route(userRoute)
   // get specific User
   .get(async (req: Request, res: Response) => {
    // Get a single User detail
    try {
     let user = await getUser(context, req.query.username);
     res.status(ResponseCode.OK).send(user);
    } catch (e) {
     res.status(ResponseCode.BAD_REQUEST).send({message: e.message});
    }
   })
   .post(async (req: Request, res: Response) => {
    // Create new User
    try {
     let user = await createUser(context, req.body.username, req.body.payload);
     res.status(ResponseCode.CREATED).send(user);
    } catch (e) {
     res.status(ResponseCode.BAD_REQUEST).send({message: e.message});
    }
   })
   .put(async (req: Request, res: Response) => {
    // Update a User
    try {
     let user = await updateUser(context, req.body.username, req.body.payload);
     res.status(ResponseCode.OK).send(user);
    } catch (e) {
     res.status(ResponseCode.BAD_REQUEST).send({message: e.message});
    }
   })
   .delete(async (req: Request, res: Response) => {
    // Delete a User
    try {
     let user = await deleteUser(context, req.query.username);
     res.status(ResponseCode.OK).send(user);
    } catch (e) {
     res.status(ResponseCode.BAD_REQUEST).send({message: e.message});
    }
   })

  // Me - Special case of User (gets the user info from access token)
  app.route(userRoute + '/me')
   // get specific User
   .get(async (req: Request, res: Response) => {
    // Get a single User detail
    try {
     let username = context.currentUser.username;
     let user = await getUser(context, username);
     res.status(ResponseCode.OK).send(user);
    } catch (e) {
     res.status(ResponseCode.BAD_REQUEST).send({message: e.message});
    }
   })
   .post(async (req: Request, res: Response) => {
    // Create new User
    try {
     let username = context.currentUser.username;
     let user = await createUser(context, username, req.body.payload);
     res.status(ResponseCode.CREATED).send(user);
    } catch (e) {
     res.status(ResponseCode.BAD_REQUEST).send({message: e.message});
    }
   })
   .put(async (req: Request, res: Response) => {
    // Update a User
    try {
     let username = context.currentUser.username;
     let user = await updateUser(context, username, req.body.payload);
     res.status(ResponseCode.OK).send(user);
    } catch (e) {
     res.status(ResponseCode.BAD_REQUEST).send({message: e.message});
    }
   })
   .delete(async (req: Request, res: Response) => {
    // Delete a User
    try {
     let username = context.currentUser.username;
     let user = await deleteUser(context, username);
     res.status(ResponseCode.OK).send(user);
    } catch (e) {
     res.status(ResponseCode.BAD_REQUEST).send({message: e.message});
    }
   })
 }
}
