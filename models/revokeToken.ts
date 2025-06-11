const revokedTokens: Set<string> = new Set(); // Set no permite repetidos

/**
 * Adds a token to the revoked tokens set, effectively invalidating it.
 * @param {string} token - The JWT token to revoke.
 * @returns {void}
*/

export const addRevokeToken = (token: string): void => {
    revokedTokens.add(token);
}

/**
 * Checks if a token has been revoked.
 * @param {string} token - The JWT token to check.
 * @returns {boolean} True if the token has been revoked, false otherwise.
*/

export const isTokenRevoked = (token: string): boolean => {
    return revokedTokens.has(token);
}

