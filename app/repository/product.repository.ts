/**
 * @description holds product repository
 */

import { ProductDataModel } from '../data/product.data';
import { Product } from '../interface/product.interface';

export class ProductRepository {
  private dataModel: any = null;

  /**
   * initializes repository
   * @param connection db connection
   */
  initialize = async (connection: any) => {
    this.dataModel = await new ProductDataModel().getDataModel(connection);
    return this;
  };

  /**
   * gets all products
   * @returns product list
   */
  getAllProducts = async () => {
    try {
      let list = await this.dataModel.find();
      if (list != null) {
        list = list.map((u: Product) => {
          return u;
        });
      }
      return list;
    } catch (error) {
      console.error('> getAllProducts error: ', error);
      throw error;
    }
  };

  /**
   * gets product by product id
   * @param product_id product id
   * @returns product
   */
  getProductById = async (product_id: string) => {
    try {
      return await this.dataModel.find({ product_id });
    } catch (error) {
      console.error('> getProductById error: ', error);
      throw error;
    }
  };

  /**
   * creates product
   * @param product product
   * @returns product
   */
  createProduct = async (product: Product) => {
    try {
      return await this.dataModel.create({
        product_id: product.product_id,
        name: product.name,
        description: product.description,
        payload: product.payload,
      });
    } catch (error) {
      console.error('> createProduct error: ', error);
      throw error;
    }
  };
}
