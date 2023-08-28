import { db } from '../config/database.js';

export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
}

// Create 
export async function createUser(name: string, email: string, password: string): Promise<IUser> {
    const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email;
  `;

    const values = [name, email, password];

    const { rows } = await db.query(query, values);

    return rows[0];
}

// Read All
export async function findAllUsers(): Promise<IUser[]> {

    const query = `
      SELECT *
      FROM users
    `;

    const { rows } = await db.query(query);

    return rows;
}

// Read
export async function findUserById(id: number): Promise<IUser | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await db.query(query, [id]);

    return rows[0] || null;
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await db.query(query, [email]);

    return rows[0] || null;
}

export async function findTopThree(): Promise<IUser[]> {
    // Use efficient JOIN with LIMIT to get top 3 users by post count
    const topUsers = await db.query(
        `SELECT 
        u.id, 
        u.name,
        pc.post_count,
        c.content AS latest_comment
      FROM users u
      INNER JOIN comments c 
        ON u.id = c.user_id
      INNER JOIN (
        SELECT user_id, MAX(created_at) latest 
        FROM comments
        GROUP BY user_id
      ) t ON c.user_id = t.user_id AND c.created_at = t.latest
      INNER JOIN (
        SELECT user_id, COUNT(id) post_count
        FROM posts
        GROUP BY user_id
      ) pc ON u.id = pc.user_id
      ORDER BY pc.post_count DESC
      LIMIT 3`
    );

    return topUsers.rows as unknown as IUser[];
}

// Update
export async function updateUser(id: number, name?: string, email?: string, password?: string) {
    const params: (string | number)[] = [id];

    let query = 'UPDATE users SET ';

    if (name) {
        query += `name = $${params.length + 1}, `;
        params.push(name);
    }

    if (email) {
        query += `email = $${params.length + 1} `;
        params.push(email);
    }

    if (password) {
        query += `email = $${params.length + 1} `;
        params.push(password);
    }

    query += `WHERE id = $1`;

    const result = await db.query(query, params);

    return result.rowCount > 0;
}

// Delete 
export async function deleteUser(id: number) {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await db.query(query, [id]);

    return result.rowCount > 0;
}
