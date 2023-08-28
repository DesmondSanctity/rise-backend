import { db } from "../config/database.js";

export interface IComment {
    id: number;
    content: string;
    post_id: number;
    user_id: number;
}

// Create
export async function createComment(content: string, post_id: number, user_id: number): Promise<IComment> {
    const query = `
    INSERT INTO comments (content, post_id, user_id)
    VALUES ($1, $2, $3)
    RETURNING id, content, post_id, user_id;
  `;

    const values = [content, post_id, user_id];

    const { rows } = await db.query(query, values);

    return rows[0];
}

// Read 
export async function findCommentById(id: number): Promise<IComment | null> {
    const query = 'SELECT * FROM comments WHERE id = $1';

    const { rows } = await db.query(query, [id]);

    return rows[0] || null;
}

// Read All
export async function findAllComments(): Promise<IComment[]> {
    const query = `SELECT * FROM comments`;

    const { rows } = await db.query(query);
    return rows;
}

// Update
export async function updateComment(id: number, content?: string) {
    const params: (string | number)[] = [id];

    let query = 'UPDATE comments SET ';

    if (content) {
        query += `content = $${params.length + 1}`;
        params.push(content);
    }

    query += ` WHERE id = $1`;

    const result = await db.query(query, params);

    return result.rowCount > 0;
}

// Delete
export async function deleteComment(id: number) {
    const query = 'DELETE FROM comments WHERE id = $1';
    const result = await db.query(query, [id]);

    return result.rowCount > 0;
}
