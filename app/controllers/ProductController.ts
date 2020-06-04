/**
 * @description holds crud operations for the product entity
 */

import ProductModel from '../models/ProductModel'

/**
 * gets all products if has admin rights
 * @param dbConn dbConn
 * @returns product list
 */
export const getAllProducts = async (dbConn) => {
 let list;
  try {
   list = await ProductModel(dbConn).find();
   if (list != null && list.length > 0) {
    list = list.map(u => {
     return u
    });
   }
  } catch (error) {
   console.error('> getAllProducts error: ', error);
   throw new Error('Error retrieving all products');
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
 let product;
 try {
  product = await ProductModel(dbConn).findOne({product_id});
 } catch (error) {
  console.error('> getProduct error: ', error);
  throw error;
 }

 return product;
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
 let createdProduct;
 try {
  createdProduct = (await ProductModel(dbConn).create({product_id, name, description, payload: payload}));
 } catch (error) {
  console.error('> createdProduct error: ', error);
  throw error;
 }

 return createdProduct;
}
