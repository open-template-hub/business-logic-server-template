/**
 * @description holds product routes
 */

import Router from 'express-promise-router';
import { Request, Response } from 'express';
import { ResponseCode } from '../models/Constant';
import { getAdmin } from '../services/authService';
import { createProduct, getAllProducts, getProduct } from '../controllers/ProductController';

const subRoutes = {
 root: '/',
 all: '/all'
}

const router = Router();

router.get(subRoutes.all, async (req: Request, res: Response) => {
 // GET endpoint to get all products, this is for admin usage,
 // you should add admin rights on context level
 await getAdmin(req);
 let products = await getAllProducts(res.locals.ctx.dbConn);
 res.status(ResponseCode.OK).json(products);
});

router.get(subRoutes.root, async (req: Request, res: Response) => {
 // Get a single Product detail
 let product = await getProduct(res.locals.ctx.dbConn, req.query.product_id);
 res.status(ResponseCode.OK).json(product);
});

router.post(subRoutes.root, async (req: Request, res: Response) => {
 // Create new Product
 await getAdmin(req);
 let product = await createProduct(res.locals.ctx.dbConn, req.body.product_id, req.body.name, req.body.description, req.body.payload);
 res.status(ResponseCode.CREATED).json(product);
});

export = router;
