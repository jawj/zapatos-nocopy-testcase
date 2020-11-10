
import * as pg from 'pg';
import * as config from '../config';

export default new pg.Pool({ connectionString: config.dbURL });
