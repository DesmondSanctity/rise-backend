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
        `SELECT u.id, u.name 
       FROM users u
       LEFT JOIN posts p ON u.id = p.user_id
       GROUP BY u.id
       ORDER BY COUNT(p.id) DESC
       LIMIT 3`
    );

    const topUsersWithComments: { id: number, name: string, latestComment: string }[] = [];

    for (const user of topUsers.rows) {
        // Get latest comment for each top user
        const latestComment = await db.query(`
            SELECT c.content
            FROM comments c
            WHERE c.user_id = $1
            ORDER BY c.created_at DESC
            LIMIT 1
            `, [user.id]);

        topUsersWithComments.push({
            ...user,
            latestComment: latestComment.rows[0]?.content
        });
    }

    return topUsersWithComments as unknown as IUser[];
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
