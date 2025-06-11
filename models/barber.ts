import { minLength, object, pipe, string, uuid, type InferInput } from "valibot";
import { v4 as uuidv4 } from 'uuid';

export const barberSchema = object({
    name: pipe(string(), minLength(3)),
    lastName: pipe(string(), minLength(3)),
})

export type Barber = InferInput<typeof barberSchema> & {id: string};

const barbers: Map<string, Barber> = new Map();


/**
 * Retrieves all barbers stored in the system.
 * @returns {Barber[]} An array of all barbers.
*/

export const getAllBarbers = (): Barber[] => {
    return Array.from(barbers.values())
}

/**
 * Retrieves a specific barber by their ID.
 * @param {string} id - The ID of the barber to retrieve.
 * @returns {Barber | undefined} The barber object if found, otherwise undefined.
*/

export const getBarberById = (id: string): Barber | undefined => {
    return barbers.get(id);
}

/**
 * Adds a new barber to the system with a generated UUID.
 * @param {Barber} barber - The barber object to add (without an id).
 * @returns {Barber} The newly created barber object with generated ID.
*/

export const addBarber = (barber: Omit<Barber, "id">): Barber => {
    
    const newBarber = {
        ...barber,
        id: uuidv4(),
    }

    barbers.set(newBarber.id, newBarber);
    return newBarber;
}

/**
 * Updates an existing barber's information.
 * @param {string} id - The ID of the barber to update.
 * @param {Barber} updatedBarber - The updated barber object.
 * @returns {Barber | null} The updated barber object if successful, null if barber wasn't found.
*/

export const updateBarber = (id: string, updatedBarber: Barber): Barber | null => {
    if (!barbers.has(id)) {
        console.error("Barber with id ", id, " not found");
        return null;
    }

    barbers.set(id, updatedBarber); //si no existe lo creo, si existe, lo reemplazo
    return updatedBarber;
}

/**
 * Deletes a barber from the system.
 * @param {string} id - The ID of the barber to delete.
 * @returns {boolean} True if the barber was successfully deleted, false if barber wasn't found.
*/

export const deleteBarber = (id: string): boolean => {
    if (!barbers.has(id)) {
        console.error("Barber with id ", id, " not found");
        return false;
    }

    barbers.delete(id);
    return true;
}