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
import { AppError, AppSuccess } from '../middlewares/responseHandler.js';


const userRouter = Router();

// POST /users
userRouter.post('/', validateCreateUser, async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user: IUser = await createUser(name, email, hashedPassword);

        if (user) {
            new AppSuccess("success", "Post created successfully", {user}, 201).send(res);
        } else {
            throw new AppError("failed", "Error creating user. Try again!", 400);
        }

    } catch (error: any) {
        res.status(400).json({
            status: error.status,
            message: error.message
        });

    }
});

// POST users/:id/posts
userRouter.post('/:id/posts', Auth, validateCreatePost, async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const { id } = req.params

    try {
        const post: IPost = await createPost(title, content, parseInt(id));

        if (post) {
            new AppSuccess("success", "Post created successfully", { post }, 201).send(res);
        } else {
            throw new AppError("failed", "Error creating user post. Try again!", 400);
        }
    } catch (error: any) {
        res.status(400).json({
            status: error.status,
            message: error.message
        });

    }
});

// GET /users
userRouter.get('/', Auth, async (req: Request, res: Response) => {
    try {
        const users: IUser[] = await findAllUsers();

        if (users) {
            new AppSuccess("success", "Users fetched successfully", {users}, 200).send(res);
        } else {
            throw new AppError("failed", "Error fetching users record. Try again!", 400);
        }

    } catch (error: any) {
        res.status(400).json({
            status: error.status,
            message: error.message
        });

    }
});

// GET /topthree
userRouter.get('/topthree', Auth, async (req: Request, res: Response) => {
    try {
        const users: IUser[] = await findTopThree();

        if (users) {
            new AppSuccess("success", "Users fetched successfully", {users}, 200).send(res);
        } else {
            throw new AppError("failed", "Error fetching users. Try again!", 400);
        }

    } catch (error: any) {
        res.status(400).json({
            status: error.status,
            message: error.message
        });

    }
});

// GET users/:id/posts
userRouter.get('/:id/posts', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const posts: IPost[] | null = await findPostsByUser(id);
        
        if (posts) {
            new AppSuccess("success", "Post fetched successfully", {posts}, 200).send(res);
        } else {
            throw new AppError("failed", "Error getting user posts. Try again!", 400);
        }

    } catch (error: any) {
        res.status(400).json({
            status: error.status,
            message: error.message
        });

    }
});

// POST /login
userRouter.post('/login', validateLogin, async (req: Request, res: Response) => {
    // Login logic
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
        throw new AppError("failed", "Invalid credentials. Try again!", 401);
    }

    // Compare hashed password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new AppError("failed", "Invalid credentials. Try again!", 401);
    }

    // Create JWT payload
    const payload = {
        user_id: user?.id,
        email: user?.email
    };

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, { expiresIn: '1d' });

    new AppSuccess("success", "Login successful", { token }, 200).send(res);
});

// GET /users/:id
userRouter.get('/:id', Auth, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const user: IUser | null = await findUserById(id);

        if (!user) {
            throw new AppError("failed", "Cannot find record. Try again!", 404);
        }

        new AppSuccess("success", "Record fetched successfully", { user }, 204).send(res);

    } catch (error: any) {
        res.status(400).json({
            status: error.status,
            message: error.message
        });

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
            throw new AppError("failed", "Error updating record. Try again!", 400);
        }

        new AppSuccess("success", "Record updated successfully", {}, 204).send(res);

    } catch (error: any) {
        res.status(400).json({
            status: error.status,
            message: error.message
        });

    }
});

// DELETE /users/:id
userRouter.delete('/:id', Auth, async (req: Request, res: Response) => {
    // Delete user
    const id = parseInt(req.params.id);

    try {
        const deleted = await deleteUser(id);

        if (!deleted) {
            throw new AppError("failed", "Error deleting record. Try again!", 400);
        }

        new AppSuccess("success", "Record deleted successfully", {}, 204).send(res);

    } catch (error: any) {
        res.status(400).json({
            status: error.status,
            message: error.message
        });

    }
});


export default userRouter;
