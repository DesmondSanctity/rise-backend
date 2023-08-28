import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import {
    IPost,
    findAllPosts,
    findPostById,
    updatePost,
    deletePost
} from '../models/post.js';
import { IComment, createComment } from '../models/comment.js';
import { validateCreateComment } from '../middlewares/validate.js';
import { Auth } from '../middlewares/auth.js';
import { AppError, AppSuccess } from '../middlewares/responseHandler.js';


const postRouter = Router();

// POST /posts/:id/comments
postRouter.post('/:id/comments', Auth, validateCreateComment, async (req: Request, res: Response) => {
    const { content, user_id } = req.body;
    const { id } = req.params;

    try {
        const comment: IComment = await createComment(content, parseInt(id), user_id);

        if (comment) {
            new AppSuccess("success", "Comment created successfully", {}, 201).send(res);
        } else {
            throw new AppError("failed", "Error creating comment. Try again!", 400);
        }

    } catch (error: any) {
        res.status(400).json({
            status: error.status,
            message: error.message
        });
    }
});

// GET /posts
postRouter.get('/', async (req: Request, res: Response) => {
    try {
        const posts: IPost[] = await findAllPosts();

        if (posts) {
            new AppSuccess("success", "Posts fetched successfully", { posts }, 200).send(res);
        } else {
            throw new AppError("failed", "Error fetching posts. Try again!", 400);
        }

    } catch (error: any) {
        res.status(400).json({
            status: error.status,
            message: error.message
        });
    }
});

// GET /posts/:id
postRouter.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const post: IPost | null = await findPostById(id);

        if (!post) {
            throw new AppError("failed", "Error fetching post. Try again!", 400);
        }
        new AppSuccess("success", "Record fetched successfully", { post }, 200).send(res);

    } catch (error: any) {
        res.status(400).json({
            status: error.status,
            message: error.message
        });
    }
});

// PUT /posts/:id
postRouter.put('/:id', Auth, async (req: Request, res: Response) => {
    // Implement update post logic
    const id = parseInt(req.params.id);
    const { title, content } = req.body;

    try {
        const updated = await updatePost(id, title, content);
        if (!updated) {
            throw new AppError("failed", "Erorr updating record. Try again!", 400);
        }
        new AppSuccess("success", "Record updated successfully", {}, 204).send(res);
    } catch (error: any) {
        res.status(400).json({
            status: error.status,
            message: error.message
        });
    }
});

// DELETE /posts/:id  
postRouter.delete('/:id', Auth, async (req: Request, res: Response) => {
    // Implement delete post logic
    const id = parseInt(req.params.id);

    try {
        const deleted = await deletePost(id);
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


export default postRouter;
