/**
 * @description holds product routes
 */

import Router from 'express-promise-router';
import { Request, Response } from 'express';
import { Context, ResponseCode } from '@open-template-hub/common';
import { ProductController } from '../controller/product.controller';
import { Product } from '../interface/product.interface';

const subRoutes = {
  root: '/',
  all: '/all',
  admin: '/admin',
};

export const adminRoutes = [subRoutes.admin];

export const router = Router();

const productController = new ProductController();

router.get(subRoutes.all, async (req: Request, res: Response) => {
  // GET endpoint to get all products, this is for admin usage,
  // you should add admin rights on context level
  let products = await productController.getAllProducts(res.locals.ctx);
  res.status(ResponseCode.OK).json(products);
});

router.get(subRoutes.root, async (req: Request, res: Response) => {
  // Get a single Product detail
  let product = await productController.getProduct(
    res.locals.ctx,
    req.query.product_id as string
  );
  res.status(ResponseCode.OK).json(product);
});

router.post(subRoutes.admin, async (req: Request, res: Response) => {
  // Create new Product
  let product = await productController.createProduct(res.locals.ctx, {
    product_id: req.body.product_id,
    name: req.body.name,
    description: req.body.description,
    payload: req.body.payload,
  } as Product);
  res.status(ResponseCode.CREATED).json(product);
});

router.delete(subRoutes.admin, async (req: Request, res: Response) => {
  // Delete a Product
  const context = res.locals.ctx as Context;
  let product = await productController.deleteProduct(
    context,
    req.query.product_id as string
  );
  res.status(ResponseCode.OK).json(product);
});
