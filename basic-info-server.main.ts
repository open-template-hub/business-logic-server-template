/**
 * @description holds server main
 */
import dotenv from 'dotenv'
import cors from 'cors';
import { Routes } from './app/routes/index.route';
import express = require('express');
import bodyParser = require('body-parser');
import { configureCronJobs } from './app/services/cron.service';

// debug logger
const debugLog = require('debug')('basic-server:' + __filename.slice(__dirname.length + 1));

// use .env file
const env = dotenv.config();
debugLog(env.parsed);

// express init
const app: express.Application = express();

// public files
app.use(express.static('public'));

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

// cron
configureCronJobs();
