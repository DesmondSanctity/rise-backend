import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import {
    IComment,
    createComment,
    findAllComments,
    findCommentById,
    updateComment,
    deleteComment
} from '../models/comment.js';
import { Auth } from '../middlewares/auth.js';
import { validateCreateComment } from '../middlewares/validate.js';


const commentRouter = Router();

// GET /comments
commentRouter.get('/', async (req: Request, res: Response) => {
    try {
        const comments: IComment[] = await findAllComments();
        return res.json(comments);

    } catch (err) {
        return res.status(500).json({ message: 'Error getting comments' });
    }
});

// GET /comments/:id
commentRouter.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const comment: IComment | null = await findCommentById(id);
        if (!comment) {
            return res.status(404).end();
        }

        return res.json(comment);

    } catch (err) {
        return res.status(500).json({ message: 'Error getting comment' });
    }
});

// PUT /comments/:id
commentRouter.put('/:id', Auth, validateCreateComment, async (req: Request, res: Response) => {
    // Update comment logic
    const id = parseInt(req.params.id);
    const { content } = req.body;

    try {
        const updated = await updateComment(id, content);

        if (!updated) {
            return res.status(404).end();
        }

        return res.status(204).end();

    } catch (err) {
        return res.status(500).json({ message: 'Error updating comment' });
    }
});

// DELETE /comments/:id
commentRouter.delete('/:id', Auth, async (req: Request, res: Response) => {
    // Delete comment logic
    const id = parseInt(req.params.id);

    try {
        const deleted = await deleteComment(id);

        if (!deleted) {
            return res.status(404).end();
        }

        return res.status(204).end();

    } catch (err) {
        return res.status(500).json({ message: 'Error deleting comment' });
    }
});


export default commentRouter;
