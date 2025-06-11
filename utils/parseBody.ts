import type { IncomingMessage } from "http";
import { StringDecoder } from "string_decoder";

/**
 * Parses the incoming HTTP request body as JSON.
 * 
 * This function:
 * 1. Collects the raw request body chunks using UTF-8 encoding
 * 2. Concatenates all chunks into a complete string
 * 3. Attempts to parse the final string as JSON
 * 4. Returns a Promise with the parsed result or error
 * 
 * @param {IncomingMessage} req - The incoming HTTP request object
 * @returns {Promise<any>} A promise that:
 *   - Resolves with the parsed JavaScript object/array if successful
 *   - Rejects with a SyntaxError if the body is not valid JSON
 *   - Rejects with other errors if stream reading fails
 * 
 * @throws {SyntaxError} When the request body contains invalid JSON
 * @throws {Error} If there's an error reading the request stream
 * 
 * @example
 * // Basic usage
 * try {
 *   const data = await parseBody(req);
 *   console.log('Parsed data:', data);
 * } catch (error) {
 *   console.error('Error parsing body:', error);
 *   res.statusCode = 400;
 *   res.end('Invalid request body');
 * }
 * 
 * @example
 * // With promise chain
 * parseBody(req)
 *   .then(data => processData(data))
 *   .catch(error => handleError(error));
 */


export const parseBody = (req: IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
        const decoder = new StringDecoder("utf-8");
        let buffer = "";

        req.on("data", (chunk) => {
            buffer += decoder.write(chunk);
        })

        req.on("end", () => {
            buffer += decoder.end();
        
            try {
                resolve(JSON.parse(buffer));
            } catch (err) {
                reject(err)
            }    
        })
    })
}