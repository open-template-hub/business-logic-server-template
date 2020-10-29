/**
 * @description holds product routes
 */

import Router from 'express-promise-router';
import { Request, Response } from 'express';
import { ResponseCode } from '../util/constant';
import { getAdmin } from '../services/auth.service';
import {ProductController} from "../controllers/product.controller";
import {Product} from "../models/product.model";

const subRoutes = {
 root: '/',
 all: '/all'
}

const router = Router();

const productController = new ProductController();

router.get(subRoutes.all, async (req: Request, res: Response) => {
 // GET endpoint to get all products, this is for admin usage,
 // you should add admin rights on context level
 await getAdmin(req);
 let products = await productController.getAllProducts(res.locals.ctx);
 res.status(ResponseCode.OK).json(products);
});

router.get(subRoutes.root, async (req: Request, res: Response) => {
 // Get a single Product detail
 let product = await productController.getProduct(res.locals.ctx, req.query.product_id);
 res.status(ResponseCode.OK).json(product);
});

router.post(subRoutes.root, async (req: Request, res: Response) => {
 // Create new Product
 await getAdmin(req);
 let product = await productController.createProduct(res.locals.ctx,
     {product_id: req.body.product_id, name: req.body.name, description: req.body.description, payload: req.body.payload} as Product);
 res.status(ResponseCode.CREATED).json(product);
});

export = router;
