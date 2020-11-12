
import * as supertest from 'supertest';
import * as moment from 'moment';
import * as db from 'zapatos/db';
import * as s from 'zapatos/schema';

import { app } from '../index';
import pool from '../db/pool';

export const allTables: s.AllTables = ['quotes'];

beforeAll(async () => {
  await db.truncate(allTables, 'CASCADE').run(pool);
  await db.insert('quotes', {
    quote: 'The way I see it, if you want the rainbow, you gotta put up with the rain.',
    attribution: 'Dolly Parton'
  }).run(pool);
});

afterAll(async () => {
  await pool.end();
});

describe('Basics', () => {
  moment.__setOffset__(1, 'minute');

  it('should provide a quote', () =>
    supertest(app)
      .get('/')
      .expect(200)
  );
});
