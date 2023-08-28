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
import { validateCreateComment, validateCreatePost } from '../middlewares/validate.js';
import { Auth } from '../middlewares/auth.js';


const postRouter = Router();

// POST /posts/:id/comments
postRouter.post('/:id/comments', Auth, validateCreateComment, async (req: Request, res: Response) => {
    const { content, post_id, user_id } = req.body;

    try {
        const comment: IComment = await createComment(content, post_id, user_id);

        return res.status(201).json(comment);

    } catch (err) {
        return res.status(500).json({ message: 'Error creating comment' });
    }
});

// GET /posts
postRouter.get('/', async (req: Request, res: Response) => {
    try {
        const posts: IPost[] = await findAllPosts();
        return res.json(posts);
    } catch (err) {
        return res.status(500).json({ message: 'Error getting posts' });
    }
});

// GET /posts/:id
postRouter.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const post: IPost | null = await findPostById(id);
        if (!post) {
            return res.status(404).end();
        }
        return res.json(post);
    } catch (err) {
        return res.status(500).json({ message: 'Error getting post' });
    }
});

// PUT /posts/:id
postRouter.put('/:id', Auth, validateCreatePost, async (req: Request, res: Response) => {
    // Implement update post logic
    const id = parseInt(req.params.id);
    const { title, content } = req.body;

    try {
        const updated = await updatePost(id, title, content);
        if (!updated) {
            return res.status(404).end();
        }
        return res.status(204).end();
    } catch (err) {
        return res.status(500).json({ message: 'Error updating post' });
    }
});

// DELETE /posts/:id  
postRouter.delete('/:id', Auth, async (req: Request, res: Response) => {
    // Implement delete post logic
    const id = parseInt(req.params.id);

    try {
        const deleted = await deletePost(id);
        if (!deleted) {
            return res.status(404).end();
        }
        return res.status(204).end();
    } catch (err) {
        return res.status(500).json({ message: 'Error deleting post' });
    }
});


export default postRouter;
