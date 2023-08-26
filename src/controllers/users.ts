import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { Router } from 'express';
import {
    IUser,
    createUser,
    findAllUsers,
    findUserById,
    updateUser,
    deleteUser
} from '../models/user.js';
import {
    validateCreateUser,
    validateLogin
} from '../middlewares/validate.js';
import { Auth } from '../middlewares/auth.js';


const userRouter = Router();

// POST /users
userRouter.post('/', validateCreateUser, async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        const user: IUser = await createUser(name, email, password);
        return res.status(201).json(user);
    } catch (err) {
        return res.status(500).json({ message: 'Error creating user' });
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

// POST /login
userRouter.post('/login', validateLogin, async (req: Request, res: Response) => {
    // Login logic
    const { email, password } = req.body;

    const user = await findUserById(email);

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT payload
    const payload = {
        id: user.id,
        email: user.email
    };

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, { expiresIn: '1d' });

    return res.json({ token });
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
userRouter.put('/:id', Auth, validateCreateUser, async (req: Request, res: Response) => {
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
