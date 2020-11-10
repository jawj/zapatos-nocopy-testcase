
import * as express from 'express';
import * as http from 'http';
import * as moment from 'moment';
import * as db from 'zapatos';

import * as config from './config';
import pool from './db/pool';


export const app = express();

export function asyncRequestHandler(fn: express.RequestHandler): express.RequestHandler {
  return (req, res, next) => fn(req, res, next).catch(next);
}

app.get('/', asyncRequestHandler(async function (req, res) {
  const quoteData = await db.selectOne('quotes', db.all,
    { order: { by: db.sql`random()`, direction: 'ASC' } }).run(pool) ??
    { quote: 'Empty database makes for poor quotes service', attribution: null };

  res.set('Content-Type', 'text/plain');
  res.status(200).send(`${quoteData.quote}
— ${quoteData.attribution ?? 'Anonymous'}

(${moment().toISOString()})`);
}));


if (config.port) {
  const server = http.createServer(app);
  server.listen(Number(config.port));
}
