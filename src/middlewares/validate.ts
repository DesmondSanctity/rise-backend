import { Request, Response, NextFunction } from 'express';
import { isEmpty } from '../utils/isEmpty.js';
import { findUserById } from '../models/user.js';
import { findPostById } from '../models/post.js';

// Email validation regex
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/

// Validate email 
function validEmail(email: string) {
    return emailRegex.test(String(email).toLowerCase());
}

// Validate password
function validPassword(password: string) {
    return passwordRegex.test(password);
}

async function userExist(user_id: number) {
    const user = await findUserById(user_id)

    if (user) {
        return true
    } else
        return false
}

async function postExist(post_id: number) {
    const post = await findPostById(post_id)

    if (post) {
        return true
    } else
        return false
}

// Signup validation
export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {

    const errors = isEmpty([
        req.body.name,
        req.body.email,
        req.body.password
    ]);

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    if (!validEmail(req.body.email)) {
        return res.status(400).json({
            error: [
                {
                    message: 'Invalid email format'
                }
            ]
        });
    }

    if (!validPassword(req.body.password)) {
        return res.status(400).json({
            error: [
                {
                    message: 'Password must be 6 characters, have 1 uppercase, 1 lowercase and 1 number'
                }
            ]
        });
    }

    next();

}

// Login validation
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {

    // Validate email and password
    const errors = isEmpty([
        req.body.email,
        req.body.password
    ]);

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    if (!validEmail(req.body.email)) {
        return res.status(400).json({
            errors: [
                {
                    message: 'Invalid email format'
                }
            ]
        });
    }

    if (!validPassword(req.body.password)) {
        return res.status(400).json({
            error: [
                {
                    message: 'Password must be 6 characters, have 1 uppercase, 1 lowercase and 1 number'
                }
            ]
        });
    }

    next();

}

// Create Post validation 
export const validateCreatePost = (req: Request, res: Response, next: NextFunction) => {

    // Validate title, body, user_id
    const errors = isEmpty([
        req.body.title,
        req.body.body,
        req.body.user_id
    ]);

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    if (!userExist(req.body.user_id)) {
        return res.status(400).json({
            errors: [
                {
                    message: 'Invalid user'
                }
            ]
        });
    }

    next();

}

// Create Comment validation
export const validateCreateComment = (req: Request, res: Response, next: NextFunction) => {

    // Validate content, post_id, user_id
    const errors = isEmpty([
        req.body.content,
        req.body.post_id,
        req.body.user_id
    ]);

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    if (!userExist(req.body.user_id)) {
        return res.status(400).json({
            errors: [
                {
                    message: 'Invalid user'
                }
            ]
        });
    }

    if (!postExist(req.body.post_id)) {
        return res.status(400).json({
            errors: [
                {
                    message: 'Invalid post'
                }
            ]
        });
    }

    next();

}