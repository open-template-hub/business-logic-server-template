import {ProductRepository} from "../repository/product.repository";
import {Context} from "../models/context.model";
import {Product} from "../models/product.model";

export class ProductController {
    /**
     * gets all products if has admin rights
     * @param dbConn dbConn
     * @returns product list
     */
     getAllProducts = async (context: Context) => {
         const productRepository = new ProductRepository(context.mongoDbProvider);
         let list = await productRepository.getRepository().find();
         if (list != null) {
             list = list.map(u => {
                 return u;
            });
         }
         return list;
    }

    /**
     * gets product by id
     * @param context
     * @param product_id
     * @returns product or null
     */
    getProduct = async (context: Context, product_id) => {
        //return ProductModel(dbConn).findOne({product_id});
        const productRepository = new ProductRepository(context.mongoDbProvider);
        return await productRepository.getRepository().find(product_id);
    }

    /**
     * creates product
     * @param context
     * @param product_id
     * @param name
     * @param description
     * @param payload
     * @returns created product
     */
    createProduct = async (context, product: Product) => {
        const productRepository = new ProductRepository(context.mongoDbProvider);
        return await productRepository.getRepository().create(
            {product_id: product.product_id, name: product.name, description: product.description, payload: product.payload});
    }
}
