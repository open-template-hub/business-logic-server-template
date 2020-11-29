/**
 * @description holds user model
 */

import mongoose from 'mongoose';

export class UserDataModel {
  private readonly collectionName: string = 'user';
  private dataSchema: mongoose.Schema;

  constructor() {
    /**
     * Provider schema
     */
    const schema: mongoose.SchemaDefinition = {
      username: { type: String, unique: true, required: true, dropDups: true },
      payload: { type: Object },
    };
    this.dataSchema = new mongoose.Schema(schema);
  }

  /**
   * creates provider model
   * @returns provider model
   */
  getDataModel = async (conn: mongoose.Connection) => {
    return conn.model(
      this.collectionName,
      this.dataSchema,
      this.collectionName
    );
  };
}
