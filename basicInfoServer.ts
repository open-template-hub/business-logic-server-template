/**
 * @description holds server main
 */
import dotenv from 'dotenv'
import express = require('express');
import bodyParser = require('body-parser');
import cors from 'cors';
import { context } from './app/context';
import { Routes } from './app/routes';
import { ResponseCode } from './app/models/Constant';
import { Request, Response } from 'express';

dotenv.config();

const app: express.Application = express();

app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())
app.use(cors());

Routes.mount(app);

const port: string = process.env.PORT || '3000' as string;

app.listen(port, () => {
 console.log('Node app is running on port', port);
});
