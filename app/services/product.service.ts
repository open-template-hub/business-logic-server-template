/**
 * @description holds crud operations for the product entity
 */

import ProductModel from '../models/product.model'

/**
 * gets all products if has admin rights
 * @param dbConn dbConn
 * @returns product list
 */
export const getAllProducts = async (dbConn) => {
 let list = ProductModel(dbConn).find();
 if (list != null) {
  list = list.map(u => {
   return u;
  });
 }

 return list;
}

/**
 * gets product by id
 * @param dbConn dbConn
 * @param product_id
 * @returns product or null
 */
export const getProduct = async (dbConn, product_id) => {
 return ProductModel(dbConn).findOne({product_id});
}

/**
 * creates product
 * @param dbConn dbConn
 * @param product_id
 * @param name
 * @param description
 * @param payload
 * @returns created product
 */
export const createProduct = async (dbConn, product_id, name, description, payload: object) => {
 return (await ProductModel(dbConn).create({product_id, name, description, payload: payload}));
}
