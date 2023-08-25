import { db } from './database.js';

// Table schemas
const usersTable = `
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
    password VARCHAR(255) NOT NULL,
  )
`;

const postsTable = `
  CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL, 
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`;

const commentsTable = `
  CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id),
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )  
`;

// Create tables
export async function createTables() {

    await db.query(usersTable);

    await db.query(postsTable);

    await db.query(commentsTable);

}