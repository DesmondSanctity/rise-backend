import { db } from '../config/database.js';

export interface IPost {
    id: number;
    title: string;
    content: string;
    user_id: number;
}

// Create
export async function createPost(title: string, content: string, user_id: number): Promise<IPost> {
    const query = `
    INSERT INTO posts (title, content, user_id)
    VALUES ($1, $2, $3)
    RETURNING id, title, content, user_id;
  `;

    const values = [title, content, user_id];

    const { rows } = await db.query(query, values);
    return rows[0];
}

// Read
export async function findPostById(id: number): Promise<IPost | null> {
    const query = 'SELECT * FROM posts WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
}

// Read All
export async function findAllPosts(): Promise<IPost[]> {
    const query = `SELECT * FROM posts`;
    const { rows } = await db.query(query);
    return rows;
}

// Update
export async function updatePost(id: number, title?: string, content?: string) {
    const params: (string | number)[] = [id];

    let query = 'UPDATE posts SET ';

    if (title) {
        query += `title = $${params.length + 1} `;
        params.push(title);
    }

    if (content) {
        query += `content = $${params.length + 1} `;
        params.push(content);
    }

    query += `WHERE id = $${params.length + 1}`;

    const result = await db.query(query, params);

    return result.rowCount > 0;
}

// Delete
export async function deletePost(id: number) {
    const query = 'DELETE FROM posts WHERE id = $1';
    const result = await db.query(query, [id]);

    return result.rowCount > 0;
}
