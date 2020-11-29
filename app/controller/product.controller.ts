import { ProductRepository } from '../repository/product.repository';
import { Context } from '../interface/context.interface';
import { Product } from '../interface/product.interface';

export class ProductController {
  /**
   * gets all products if has admin rights
   * @param context context
   * @returns product list
   */
  getAllProducts = async (context: Context) => {
    const productRepository = await new ProductRepository().initialize(
      context.mongodb_provider.getConnection()
    );

    return await productRepository.getAllProducts();
  };

  /**
   * gets product by id
   * @param context
   * @param product_id
   * @returns product or null
   */
  getProduct = async (context: Context, product_id) => {
    const productRepository = await new ProductRepository().initialize(
      context.mongodb_provider.getConnection()
    );

    return await productRepository.getProductById(product_id);
  };

  /**
   * creates product
   * @param context
   * @param product
   * @returns created product
   */
  createProduct = async (context: Context, product: Product) => {
    const productRepository = await new ProductRepository().initialize(
      context.mongodb_provider.getConnection()
    );

    return await productRepository.createProduct(product);
  };
}
