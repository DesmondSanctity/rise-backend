import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import { Router } from 'express';
import {
    IUser,
    createUser,
    findAllUsers,
    findUserById,
    updateUser,
    deleteUser,
    findUserByEmail,
    findTopThree
} from '../models/user.js';
import { IPost, createPost, findPostsByUser } from '../models/post.js';
import {
    validateCreateUser,
    validateLogin,
    validateCreatePost
} from '../middlewares/validate.js';
import { Auth } from '../middlewares/auth.js';


const userRouter = Router();

// POST /users
userRouter.post('/', validateCreateUser, async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user: IUser = await createUser(name, email, hashedPassword);

        return res.status(201).json(user);
    } catch (err) {
        return res.status(500).json({ message: 'Error creating user' });
    }
});

// POST users/:id/posts
userRouter.post('/:id/posts', Auth, validateCreatePost, async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const { id  } = req.params

    try {
        const post: IPost = await createPost(title, content, parseInt(id));
        return res.status(201).json(post);
    } catch (err) {
        return res.status(500).json({ message: 'Error creating post' });
    }
});

// GET /users
userRouter.get('/', Auth, async (req: Request, res: Response) => {
    try {
        const users: IUser[] = await findAllUsers();

        return res.json(users);
    } catch (err) {
        return res.status(500).json({ message: 'Error getting users' });
    }
});

// GET /topthree
userRouter.get('/topthree', Auth, async (req: Request, res: Response) => {
    try {
        const users: IUser[] = await findTopThree();

        return res.json(users);
    } catch (err) {
        return res.status(500).json({ message: 'Error getting top three users' });
    }
});

// GET users/:id/posts
userRouter.get('/:id/posts', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const posts: IPost[] | null = await findPostsByUser(id);
        return res.json(posts);
    } catch (err) {
        return res.status(500).json({ message: 'Error getting posts' });
    }
});

// POST /login
userRouter.post('/login', validateLogin, async (req: Request, res: Response) => {
    // Login logic
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
        return res.status(401).json({ message: 'Invalid email' });
    }

    // Compare hashed password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    // Create JWT payload
    const payload = {
        user_id: user?.id,
        email: user?.email
    };

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, { expiresIn: '1d' });

    user.password = ""

    return res.json({ user, token });
});

// GET /users/:id
userRouter.get('/:id', Auth, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const user: IUser | null = await findUserById(id);

        if (!user) {
            return res.status(404).end();
        }

        return res.json(user);

    } catch (err) {
        return res.status(500).json({ message: 'Error getting user' });
    }
});

// PUT /users/:id
userRouter.put('/:id', Auth, async (req: Request, res: Response) => {
    // Update user
    const id = parseInt(req.params.id);
    const { name, email, password } = req.body;

    try {
        const updated = await updateUser(id, name, email, password);

        if (!updated) {
            return res.status(404).end();
        }

        return res.status(204).end();

    } catch (err) {
        return res.status(500).json({ message: 'Error updating user' });
    }
});

// DELETE /users/:id
userRouter.delete('/:id', Auth, async (req: Request, res: Response) => {
    // Delete user
    const id = parseInt(req.params.id);

    try {
        const deleted = await deleteUser(id);

        if (!deleted) {
            return res.status(404).end();
        }

        return res.status(204).end();

    } catch (err) {
        return res.status(500).json({ message: 'Error deleting user' });
    }
});


export default userRouter;
