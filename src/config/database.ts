import pkg from 'pg';
import dotenv from 'dotenv';


const { Pool } = pkg;

dotenv.config()

export const db = new Pool({
    // use this for local postgres connection
    // user: process.env.DB_USER,
    // host: process.env.DB_HOST,
    // database: process.env.DB_NAME,
    // password: `${process.env.DB_PASSWORD}`,
    // port: process.env.DB_PORT as unknown as number

    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});