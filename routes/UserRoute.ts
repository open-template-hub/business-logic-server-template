/**
 * @description holds user routes
 */

import {Request, Response} from "express";
import { getAllUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/UserController";
import { ResponseCode } from "../models/Constant";

const userRoute = "/user";

export class UserRoute {      
    public routes = (app, context): void => {   
        // User 
        app.route(userRoute + "/all") 
        // GET endpoint to get all users, this is for admin usage,
        // you should add admin rights on context level
        .get(async(req: Request, res: Response) => {
          try {
            let users = await getAllUsers(context);
            res.status(ResponseCode.OK).send(users);
          } catch (e) {
            res.status(ResponseCode.BAD_REQUEST).send({ message: e.message });
          } 
        })     

        // User detail
        app.route(userRoute)
        // get specific User
        .get(async(req: Request, res: Response) => {
          // Get a single User detail 
          try {
            let user = await getUser(context);           
            res.status(ResponseCode.OK).send(user);
          } catch (e) {
            res.status(ResponseCode.BAD_REQUEST).send({ message: e.message });
          } 
        })
        .post(async(req: Request, res: Response) => {   
          // Create new User  
          try {
            let user = await createUser(context, req.body);           
            res.status(ResponseCode.CREATED).send(user);
          } catch (e) {
            res.status(ResponseCode.BAD_REQUEST).send({ message: e.message });
          }        
        })
        .put(async(req: Request, res: Response) => {
          // Update a User           
          try {
            let user = await updateUser(context, req.body);           
            res.status(ResponseCode.OK).send(user);
          } catch (e) {
            res.status(ResponseCode.BAD_REQUEST).send({ message: e.message });
          } 
        })
        .delete(async(req: Request, res: Response) => {       
          // Delete a User     
          try {
            let user = await deleteUser(context);           
            res.status(ResponseCode.OK).send(user);
          } catch (e) {
            res.status(ResponseCode.BAD_REQUEST).send({ message: e.message });
          } 
        })
    }
}