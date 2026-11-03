// needed to use user in request
/// <reference path="../../types/express.d.ts" />

import type { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import config from 'config';

import { container } from '../../application/services/DiContainer.js';

const JWT_SECRET: string = config.get('Auth.JWTSECRET');

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                messageHu: 'Nincs érvényes token. Kérem jelentkezzen be újra.',
                messageEn: 'No valid token provided. Please log in again.',
            });
        }

        const decoded = JWT.verify(token, JWT_SECRET) as any;

        if (!decoded || !decoded.sid) {
            return res.status(401).json({
                messageHu: 'Érvénytelen token. Kérem jelentkezzen be újra.',
                messageEn: 'Invalid token. Please log in again.',
            });
        }

        const session = await container.sessionStore.getSession(decoded.sid);

        if (!session) {
            return res.status(401).json({
                messageHu:
                    'Érvénytelen munkamenet. Kérem jelentkezzen be újra.',
                messageEn: 'Invalid session. Please log in again.',
            });
        }

        req.user = {
            id: session.userId,
            role: session.role,
            email: session.email,
            sessionId: decoded.sid,
        };

        next();
    } catch (error) {
        return res.status(500).json({
            messageHu:
                'A munkamenet lejárt, vagy érvénytelen. Kérem jelentkezzen be újra.',
            messageEn:
                'An error occurred during authentication. Please log in again.',
        });
    }
};

export default authMiddleware;
