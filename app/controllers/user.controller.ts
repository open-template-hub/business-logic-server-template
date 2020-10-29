import {Context} from "../models/context.model";
import {UserRepository} from "../repository/user.repository";
import {User} from "../models/user.model";

export class UserController {
    /**
     * gets all users
     * @param dbConn dbConn
     * @returns user list
     */
    getAllUsers = async (context: Context) => {
        const userRepository = new UserRepository(context.mongoDbProvider);
        let list = await userRepository.getRepository().find();
        if (list != null) {
            list = list.map(u => {
                return u;
            });
        }
        return list;
    }

    /**
     * gets user by id
     * @param dbConn dbConn
     * @returns user or null
     */
    getUser = async (context: Context, username) => {
        const userRepository = new UserRepository(context.mongoDbProvider);
        return await userRepository.getRepository().findOne({username: username});
    }

    /**
     * creates user
     * @param dbConn dbConn
     * @param args user
     * @returns created user
     */
    createUser = async (context: Context, user: User) => {
        const userRepository = new UserRepository(context.mongoDbProvider);
        return await userRepository.getRepository().create({username: user.username, payload: user.payload});
    }

    /**
     * deletes user
     * @param dbConn dbConn
     * @returns deleted user or null
     */
    deleteUser = async (context: Context, username) => {
        //return UserModel(dbConn).findOneAndDelete({username: username});
        const userRepository = new UserRepository(context.mongoDbProvider);
        return await userRepository.getRepository().findOneAndDelete({username: username});
    }

    /**
     * updates user
     * @param dbConn dbConn
     * @param args user
     * @returns updated user or null
     */
    updateUser = async (context: Context, user: User) => {
        const userRepository = new UserRepository(context.mongoDbProvider);
        return await userRepository.getRepository().findOneAndUpdate(
            {username: user.username}, {payload: user.payload}, {new: true}
            );
    }

    /**
     * search users by username prefix
     * @param dbConn dbConn
     * @returns users or null
     */
    search = async (context: Context, prefix, limit?: number) => {
        if (!limit) {
            limit = 10;
        }
        const userRepository = new UserRepository(context.mongoDbProvider);
        return await userRepository.getRepository().find({username: {'$regex': prefix, '$options': 'i'}}, null, {limit}).select('username -_id');
    }

}
