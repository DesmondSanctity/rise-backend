import { Request, Response, NextFunction } from 'express';
import { isEmpty } from '../utils/isEmpty.js';
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

    // Validate title, body, as Auth validates user
    const errors = isEmpty([
        req.body.title,
        req.body.content,
    ]);

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();

}

// Create Comment validation
export const validateCreateComment = (req: Request, res: Response, next: NextFunction) => {

    // Validate content, post_id, as Auth validates user
    const errors = isEmpty([
        req.body.content,
    ]);

    if (errors.length > 0) {
        return res.status(400).json({ errors });
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