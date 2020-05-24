/**
 * @description holds server main
 */
import express = require('express');
import bodyParser = require('body-parser');
import dotenv from 'dotenv'
import { UserRoute } from './app/routes/UserRoute';
import { context } from './app/context';
import { ResponseCode } from './app/models/Constant';

dotenv.config();

const userRoute = new UserRoute();

const port: string = process.env.PORT || '3000' as string;

const app: express.Application = express();

app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

app.use(async (req, res, next) => {
 res.header('Access-Control-Allow-Origin', '*');
 res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept');
 res.header('Access-Control-Allow-Methods', 'POST, GET, PATCH, PUT, DELETE');
 try {
  // create context
  let ctx = await context(req);

  // routes with context
  userRoute.routes(app, ctx);

  next();
 } catch (e) {
  res.status(e.responseCode ? e.responseCode : ResponseCode.INTERNAL_SERVER_ERROR).send(e.message);
 }
});

app.listen(port, () => {
 console.log('Node app is running on port', port);
});
