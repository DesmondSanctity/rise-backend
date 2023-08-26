import pkg from 'pg';
const { Pool } = pkg;

export const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'anon',
  port: 5432,
});