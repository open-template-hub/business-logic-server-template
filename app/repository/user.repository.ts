import { UserDataModel } from '../data/user.data';
import { User } from '../interface/user.interface';

export class UserRepository {
  private dataModel: any = null;

  initialize = async (connection: any) => {
    this.dataModel = await new UserDataModel().getDataModel(connection);
    return this;
  };

  getAllUsers = async () => {
    try {
      let list = await this.dataModel.find();
      if (list != null) {
        list = list.map((u) => {
          return u;
        });
      }
      return list;
    } catch (error) {
      console.error('> getAllUsers error: ', error);
      throw error;
    }
  };

  getUserByUsername = async (username: string) => {
    try {
      return await this.dataModel.findOne({ username });
    } catch (error) {
      console.error('> getUserByUsername error: ', error);
      throw error;
    }
  };

  createUser = async (user: User) => {
    try {
      return await this.dataModel.create({
        username: user.username,
        payload: user.payload,
      });
    } catch (error) {
      console.error('> createUser error: ', error);
      throw error;
    }
  };

  deleteUserByUsername = async (username: string) => {
    try {
      return await this.dataModel.findOneAndDelete({ username });
    } catch (error) {
      console.error('> deleteUserByUsername error: ', error);
      throw error;
    }
  };

  updateUser = async (user: User) => {
    try {
      return await this.dataModel.findOneAndUpdate(
        { username: user.username },
        { payload: user.payload },
        { new: true }
      );
    } catch (error) {
      console.error('> updateUser error: ', error);
      throw error;
    }
  };

  searchUser = async (prefix, limit: number) => {
    try {
      return await this.dataModel
        .find({ username: { $regex: prefix, $options: 'i' } }, null, { limit })
        .select('username -_id');
    } catch (error) {
      console.error('> searchUser error: ', error);
      throw error;
    }
  };
}
