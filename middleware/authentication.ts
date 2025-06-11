import type { IncomingMessage, ServerResponse } from "http";
import { verify, type JwtPayload } from "jsonwebtoken";
import { isTokenRevoked } from "../models";
import config from "../config";


/**
 * Extended interface for IncomingMessage that includes an optional user property
 * containing the decoded JWT payload.
*/

export interface AuthenticatedRequest extends IncomingMessage {
    user?: JwtPayload | string;
}

/**
 * Middleware function to authenticate JWT tokens.
 * 
 * This function:
 * 1. Checks for the presence of an Authorization header with a Bearer token
 * 2. Verifies if the token has been revoked
 * 3. Validates the token's signature and expiration
 * 4. Attaches the decoded payload to the request object if valid
 * 
 * @param {AuthenticatedRequest} req - The incoming HTTP request (extended with user property)
 * @param {ServerResponse} res - The HTTP server response object
 * @returns {Promise<boolean>} A promise that resolves to:
 *   - true if authentication succeeded
 *   - false if authentication failed (response is ended with appropriate status code)
 * 
 * @example
 * // In your route handler:
 * if (!await authenticateToken(req, res)) return;
 * // Proceed with authenticated logic
*/

export const authenticateToken = async (
    req: AuthenticatedRequest,
    res: ServerResponse,
): Promise<boolean> => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1];
    // ["Bearer", "asdfdjkagbnikjd"] split(" ")[1] traeria el token

    if(!token) {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: "Unauthorized" }));
        return false;
    }
    if (isTokenRevoked(token)) {
        res.statusCode = 403;
        res.end(JSON.stringify({ message: "Forbidden" }));
        return false;
    }

    try {
        const decoded = verify(token, config.jwtSecret);

        req.user = decoded;

        return true;
    } catch (_err) {
        res.statusCode = 403;
        res.end(JSON.stringify({ message: "Forbidden" }));
        return false;
    }
}