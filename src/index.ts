
import * as express from 'express';
import * as http from 'http';
import * as moment from 'moment';
import * as db from 'zapatos/db';
import type * as s from 'zapatos/schema';
import type * as c from 'zapatos/custom';

import * as config from './config';
import pool from './db/pool';


export const app = express();

export function asyncRequestHandler(fn: express.RequestHandler): express.RequestHandler {
  return (req, res, next) => fn(req, res, next).catch(next);
}

app.get('/', asyncRequestHandler(async function (req, res) {
  const
    quoteWhere: s.quotes.Whereable = { quote: db.sql`${db.self} IS NOT NULL` },
    quoteData = await db.selectOne('quotes', quoteWhere,
      { order: { by: db.sql`random()`, direction: 'ASC' } }).run(pool) ??
      { quote: 'Empty database makes for poor quotes service', attribution: null, location: null };

  res.set('Content-Type', 'text/plain');
  res.status(200).send(`${quoteData.quote}
— ${quoteData.attribution ?? 'Anonymous'}

(${moment().toISOString()} at ${quoteData.location ?? 'unknown location'})`);
}));


if (config.port) {
  const server = http.createServer(app);
  server.listen(Number(config.port));
}
