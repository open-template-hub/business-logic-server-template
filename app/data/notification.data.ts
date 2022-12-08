/**
 * @description holds product data model
 */

import mongoose from 'mongoose';

export class NotificationDataModel {
  private readonly collectionName: string = 'notification';
  private readonly dataSchema: mongoose.Schema;

  constructor() {
    /**
     * Provider schema
     */
    const schema: mongoose.SchemaDefinition = {
      username: { type: String, required: true, dropDups: true },
      message: { type: String },
      read: { type: Boolean, required: true, default: false },
      timestamp: { type: Number, required: true },
      sender: { type: String, required: true },
      category: { type: String, required: true },
      image: { type: String },
    };

    this.dataSchema = new mongoose.Schema( schema );
  }

  /**
   * creates provider model
   * @returns provider model
   */
  getDataModel = async ( conn: mongoose.Connection ) => {
    return conn.model(
        this.collectionName,
        this.dataSchema,
        this.collectionName
    );
  };
}
