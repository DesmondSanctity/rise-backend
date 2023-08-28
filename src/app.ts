import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import redis from 'redis';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connectToDB } from './config/schema.js';
import userRouter from './controllers/users.js';
import postRouter from './controllers/posts.js';
import commentRouter from './controllers/comments.js';
import { AppError } from './middlewares/responseHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json({ limit: "100mb" }));
app.use(express.json());
app.disable('x-powered-by'); // less hackers know about our stack

const port = process.env.PORT || 5000;

// create a redis client connection
export const client = redis.createClient({
    url: process.env.REDIS_URL,
});

// on the connection
client.on("connect", () => console.log("Connected to Redis"));

await client.connect();

// Routes
app.get('/', (req, res) => {
    res.send('Hello World');
});


// Your middleware function to handle errors
const errorHandler = (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            status: err.status,
        });

    } else {
        return res.status(500).json({
            status: 'failed',
            message: 'Internal server error',
        });
    }
};

app.use(errorHandler);

// Define the routes
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

// Start server
async function startServer() {

    await connectToDB()
        .then(result => {
            console.log('Database connected successfully')
        })
        .catch(error => {
            console.log(error); // need to pass to error handler
        });

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });

}

startServer();


export default app;