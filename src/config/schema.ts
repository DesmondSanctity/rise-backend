import { db } from './database.js';

// Table schemas
const usersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
  );

  CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
  CREATE INDEX IF NOT EXISTS users_name_idx ON users(name);
`;

const postsTable = `
  CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL, 
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);
  CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at);
`;

const commentsTable = `
  CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id),
    user_id INTEGER REFERENCES users(id),
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  
  CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments(post_id);
  CREATE INDEX IF NOT EXISTS comments_user_id_idx ON comments(user_id);
  CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at);
`;

export const connectToDB = async () => {
    try {
        await db.connect();

        await db.query(usersTable);

        await db.query(postsTable);

        await db.query(commentsTable);
        
    } catch (err: any) {
        throw new Error (err)
    }
};

export async function disconnectDB() {
    if(db) {
      await db.end();
    }
  }