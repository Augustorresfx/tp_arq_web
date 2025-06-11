import type { ServerResponse } from "http"
import type { AuthenticatedRequest } from "./authentication"
import type { User } from "../models"

/**
 * Creates a role-based authorization middleware function.
 * 
 * This function returns a middleware that checks if the authenticated user
 * has one of the required roles to access a route.
 * 
 * @param {...string} roles - Spread parameter of allowed roles
 * @returns {Function} An async middleware function that:
 *   - Takes an AuthenticatedRequest and ServerResponse
 *   - Returns Promise<boolean> indicating authorization success
 */

export const authorizeRoles = (...roles: string[]) => {
    return async (
        req: AuthenticatedRequest,
        res: ServerResponse,
    ): Promise<boolean> => {
        const userRole = (req.user as User).role

        if(!userRole || !roles.includes(userRole)) {
            res.statusCode = 403;
            res.end(JSON.stringify({ message: "Forbidden" }));
            return false;
        }

        return true;
    }
}