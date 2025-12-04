import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'

/**
 * Auth middleware that validates JWT locally using the shared secret.
 * Expects Authorization: Bearer <token> header.
 */
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers['authorization'] as string | undefined

        if (!authHeader) {
            return res.status(401).json({ error: 'Missing Authorization header' })
        }

        const parts = authHeader.split(' ')
        if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
            return res.status(401).json({ error: 'Invalid Authorization header' })
        }

        const token = parts[1]
        const secret = process.env.JWT_SECRET

        if (!secret) {
            console.error('JWT_SECRET not configured')
            return res.status(500).json({ error: 'Server configuration error' })
        }

        // Verify JWT signature and expiration
        const payload = jwt.verify(token, secret)

        // Attach user payload to request
        // @ts-ignore - augmenting request with user
        req.user = payload

        return next()
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' })
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' })
        }
        console.error('authMiddleware error:', err.message || err)
        return res.status(401).json({ error: 'Unauthorized' })
    }
}

export default authMiddleware
