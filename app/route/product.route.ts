/**
 * @description holds product routes
 */

import {
  authorizedBy,
  ResponseCode,
  UserRole,
} from '@open-template-hub/common';
import { Request, Response } from 'express';
import Router from 'express-promise-router';
import { ProductController } from '../controller/product.controller';
import { Product } from '../interface/product.interface';

const subRoutes = {
  root: '/',
  all: '/all',
  admin: '/admin',
};

export const router = Router();

const productController = new ProductController();

router.get(
  subRoutes.all,
  authorizedBy([UserRole.ADMIN, UserRole.DEFAULT]),
  async (req: Request, res: Response) => {
    // GET endpoint to get all products, this is for admin usage,
    // you should add admin rights on context level
    let products = await productController.getAllProducts(res.locals.ctx);
    res.status(ResponseCode.OK).json(products);
  }
);

router.get(subRoutes.root, async (req: Request, res: Response) => {
  // Get a single Product detail
  let product = await productController.getProduct(
    res.locals.ctx,
    req.query.product_id as string
  );
  res.status(ResponseCode.OK).json(product);
});

router.post(
  subRoutes.admin,
  authorizedBy([UserRole.ADMIN]),
  async (req: Request, res: Response) => {
    // Create new Product
    let product = await productController.createProduct(res.locals.ctx, {
      product_id: req.body.product_id,
      name: req.body.name,
      description: req.body.description,
      payload: req.body.payload,
    } as Product);
    res.status(ResponseCode.CREATED).json(product);
  }
);

router.delete(
  subRoutes.admin,
  authorizedBy([UserRole.ADMIN]),
  async (req: Request, res: Response) => {
    // Delete a Product
    const context = res.locals.ctx;
    let product = await productController.deleteProduct(
      context,
      req.query.product_id as string
    );
    res.status(ResponseCode.OK).json(product);
  }
);
