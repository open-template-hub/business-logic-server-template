/**
 * @description holds product model
 */

import mongoose from 'mongoose';
import {MongoDbProvider} from "../providers/mongodb.provider";

export class ProductRepository {
    private readonly collectionName: string = 'products';
    private productSchema: mongoose.Schema;

    constructor(private readonly provider: MongoDbProvider) {
        /**
         * Product schema
         */
        const schema: mongoose.SchemaDefinition = {
            product_id: {type: String, unique: true, required: true, dropDups: true},
            name: {type: String, required: true},
            description: {type: String, required: true},
            payload: {type: Object}
        };

        this.productSchema = new mongoose.Schema(schema);
    }

    /**
     * creates product model
     * @return Product model
     */
    getRepository = () => {
        return this.provider.getConnection().model(this.collectionName, this.productSchema, this.collectionName);
    }
}
