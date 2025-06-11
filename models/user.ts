import { compare, hash } from "bcrypt"
import { email, minLength, object, pipe, string, type InferInput } from "valibot"
import { v4 as uuidv4 } from 'uuid';

/*
Para validaciones o transformaciones detalladas, un schema puede ser 
"wrappeado" o "encapsulado" en un pipeline.

Especialmente para funciones schema como string, number, date, object y array
es útil para validar propiedades más allá del tipo de dato raw.

Sirve para "dar más caracteristicas", ej para un string:
mínimo de longitud, máximo, etc.
*/

const emailSchema = pipe(string(), email("Invalid email"))
const passwordSchema = pipe(string(), minLength(6))

export const authSchema = object({
    email: emailSchema,
    password: passwordSchema
})

export enum Role {
    "ADMIN" = "admin",
    "USER" = "user",

}

export type User = InferInput<typeof authSchema> & {
    id: string;
    role: Role;
    refreshToken?: string;
}

const users: Map<string, User> = new Map();

/**
 * Creates a new user with the given email and password
 * The password is hashed before storing
 * 
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {Promise<User>} - The created user
 */

export const createUser = async ( 
    email: string,
    password: string,
    role: string,
): Promise<User> => {
    const hashedPassword = await hash(password, 10)

    const isValidRole = Object.values(Role).includes(role as Role);
    const userRole = isValidRole ? (role as Role) : Role.USER;

    const newUser: User = {
        id: uuidv4(), // Genera un uuid único  
        email,
        password: hashedPassword,
        role: userRole,
    }

    users.set(email, newUser);
    return newUser;
}

/**
 * Finds a user by their given email
 * 
 * @param {string} email - The email of the user to find
 * @return {User | undefined} - The user if found, otherwise undefined
 */

export const findUserByEmail = (email: string): User | undefined => {
    return users.get(email)
}

/**
 * Validates a user's password
 * 
 * @param {User} user -  The user whose password is to be validated
 * @param {string} password - The password to validate
 * @return {Promise<boolean>} - True if the password is valid, otherwise false
*/

export const validatePassword = async (
    user: User,
    password: string,
): Promise<boolean> => {
    return compare(password, user.password)
}

/**
 * Revoke Token
 * 
 * @param {string} email - The email of the user to revoke the token
 * @return {boolean} - True if the token is revoked, otherwise false
 */

export const revokeUserToken = (email: string): boolean => {
    const foundUser = users.get(email);
    if (!foundUser) {
        return false;
    }
    
    users.set(email, { ...foundUser, refreshToken: undefined })
    return true;
}