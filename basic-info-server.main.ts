/**
 * @description holds server main
 */
import dotenv from 'dotenv'
import cors from 'cors';
import { Routes } from './app/routes';
import express = require('express');
import bodyParser = require('body-parser');

// use .env file
const env = dotenv.config();
console.log(env.parsed);

// express init
const app: express.Application = express();

// parse application/json
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors());

// mount routes
Routes.mount(app);

// listen port
const port: string = process.env.PORT || '4002' as string;
app.listen(port, () => {
 console.info('Basic Info Server is running on port: ', port);
});
