/// <reference path="../typings.d.ts" />

require('dotenv').config();
var mqtt = require('mqtt');

import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as ejs from 'ejs';
import * as HttpStatus from 'http-status-codes';
import * as express from 'express';
import * as cors from 'cors';

import Knex = require('knex');
import { MySqlConnectionConfig } from 'knex';
import { Router, Request, Response, NextFunction } from 'express';
import { Jwt } from './models/jwt';

import indexRoute from './routes/index';
import authRoute from './routes/auth';
import lineLiffRoute from './routes/line_liff';
import managerRoute from './routes/manager';
import webhookRoute from './routes/webhook';

// Assign router to the express.Router() instance
const app: express.Application = express();

const jwt = new Jwt();

//view engine setup
app.set('views', path.join(__dirname, '../views'));
app.engine('.ejs', ejs.renderFile);
app.set('view engine', 'ejs');

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname,'../public','favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Make Images "Uploads" Folder Publicly Available
app.use('/upload', express.static('upload'));
// app.use(cors());
var corsOptions = {
  origin: process.env.CORS_URL
};

app.use(cors(corsOptions));

let connection: MySqlConnectionConfig = {
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
  debug: true,
  dateStrings: true
}

let db = Knex({
  client: 'mysql',
  connection: connection,
  pool: {
    min: 0,
    max: 100,
    afterCreate: (conn, done) => {
      conn.query('SET NAMES utf8', (err) => {
        done(err, conn);
      });
    }
  },
});

app.use((req: Request, res: Response, next: NextFunction) => {
  req.db = db;
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const client = mqtt.connect(`mqtt://${process.env.MQTT_HOST}`, {
    clientId: 'nher_api_client-' + Math.floor(Math.random() * 1000000),
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWORD
  });

  req.mqttClient = client;

  next();
});

let checkAuth = (req: Request, res: Response, next: NextFunction) => {
  let token: any = null;

  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  } else {
    token = req.body.token;
  }

  jwt.verify(token)
    .then((decoded: any) => {
      req.decoded = decoded;
      next();
    }, err => {
      return res.send({
        ok: false,
        message: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
        code: HttpStatus.UNAUTHORIZED
      });
    });
}

app.use('/', indexRoute);

app.use('/webhook', webhookRoute);

app.use('/api/auth', authRoute);

app.use('/api/line_liff', checkAuth, lineLiffRoute);

app.use('/api/manager', checkAuth, managerRoute);


// app.use('/api/line_liff/q', lineLiffQRoute);

//error handlers

if (process.env.NODE_ENV === 'development') {
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: {
        ok: false,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
      }
    });
  });
}

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(HttpStatus.NOT_FOUND).json({
    error: {
      ok: false,
      code: HttpStatus.NOT_FOUND,
      error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
    }
  });
});

export default app;
