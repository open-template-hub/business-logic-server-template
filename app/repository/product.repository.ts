import { ProductDataModel } from '../data/product.data';
import { Product } from '../interface/product.interface';

export class ProductRepository {
  private dataModel: any = null;

  initialize = async (connection: any) => {
    this.dataModel = await new ProductDataModel().getDataModel(connection);
    return this;
  };

  getAllProducts = async () => {
    try {
      let list = await this.dataModel.find();
      if (list != null) {
        list = list.map((u) => {
          return u;
        });
      }
      return list;
    } catch (error) {
      console.error('> getAllProducts error: ', error);
      throw error;
    }
  };

  getProductById = async (product_id) => {
    try {
      return await this.dataModel.find(product_id);
    } catch (error) {
      console.error('> getProductById error: ', error);
      throw error;
    }
  };

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
