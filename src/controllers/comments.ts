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
import { AppError, AppSuccess } from '../middlewares/responseHandler.js';


const commentRouter = Router();

// GET /comments
commentRouter.get('/', async (req: Request, res: Response) => {
    try {
        const comments: IComment[] = await findAllComments();
        
        if (comments) {
            new AppSuccess("success", "Comments fetched successfully", {comments}, 200).send(res);
        } else {
            throw new AppError("failed", "Error fetching comments. Try again!", 400);
        }

    } catch (error: any) {
        res.status(400).json({
            status: error.status,
            message: error.message
          });
    }
});

// GET /comments/:id
commentRouter.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const comment: IComment | null = await findCommentById(id);
        if (!comment) {
            throw new AppError("failed", "Error fetching comment. Try again!", 400);
        }
        
        new AppSuccess("success", "Record fetched successfully", { comment}, 200).send(res);

    } catch (error: any) {
        res.status(400).json({
            status: error.status,
            message: error.message
          });
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
            throw new AppError("failed", "Error updating comment. Try again!", 400);
        }

        new AppSuccess("success", "Record updated successfully", { }, 204).send(res);

    } catch (error: any) {
        res.status(400).json({
            status: error.status,
            message: error.message
          });
    }
});

// DELETE /comments/:id
commentRouter.delete('/:id', Auth, async (req: Request, res: Response) => {
    // Delete comment logic
    const id = parseInt(req.params.id);

    try {
        const deleted = await deleteComment(id);

        if (!deleted) {
            throw new AppError("failed", "Error deleting comment. Try again!", 400);
        }

        new AppSuccess("success", "Record deleted successfully", { }, 204).send(res);

    } catch (error: any) {
        res.status(400).json({
            status: error.status,
            message: error.message
          });
    }
});


export default commentRouter;
