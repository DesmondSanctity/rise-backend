import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface JWTUser {
    user: string | undefined | JwtPayload;
    email: string;
}

interface DecodedToken extends JwtPayload {
    exp: number;
}

/** auth middleware */
export const Auth = async (req: Request & JWTUser, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        throw new Error('Unauthorized');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, {
        algorithms: ['HS256']
    }) as DecodedToken;

    if (!decodedToken) {
        throw new Error('Forbidden')
    }
    
    if (decodedToken.exp <= Math.floor(Date.now() / 1000)) {
        throw new Error('Token expired');
    }

    req.user = decodedToken;

    next();

}
