import { date, email, maxValue, minLength, minValue, number, object, pipe, string, uuid, type InferInput } from "valibot";
import { v4 as uuidv4 } from 'uuid';

export const appointmentSchema = object({
    name: pipe(string(), minLength(3)),
    start: pipe(date()),
    minutesDuration: pipe(number(), minValue(30), maxValue(480)),
    price: pipe(number()),
    barberId: pipe(string(), uuid("Invalid barber ID")),
    clientEmail: pipe(string(), email("Invalid email")),
});

export type Appointment = InferInput<typeof appointmentSchema> & { id: string };

const appointments: Map<string, Appointment> = new Map();

/**
 * Retrieves all appointments stored in the system.
 * @returns {Appointment[]} An array of all appointments.
*/

export const getAllAppointments = (): Appointment[] => {
    return Array.from(appointments.values())
}

/**
 * Retrieves a specific appointment by their ID.
 * @param {string} id - The ID of the appointment to retrieve.
 * @returns {Appointment | undefined} The appointment object if found, otherwise undefined.
*/

export const getAppointmentById = (id: string): Appointment | undefined => {
    return appointments.get(id);
}

/**
 * Search for the registered appointments of a barber
 * @param {string} id - The barber id 
 * @returns {Appointment[]} An array of the appointments registered with the id of the barber
*/

export const getAppointmentsByBarberId = (id: string): Appointment[] => {
    const barberAppointments = Array.from(appointments.values()).filter(
        (appointment) => appointment.barberId === id
    );
    return barberAppointments;
};

/**
 * Adds a new appointment to the system with a generated UUID.
 * @param {Appointment} appointment - The appointment object to add (without an id).
 * @returns {Appointment} The newly created appointment object with generated ID.
*/

export const addAppointment = (appointment: Omit<Appointment, "id">): Appointment => {

    const newAppointment = {
        ...appointment,
        id: uuidv4(),
    }

    appointments.set(newAppointment.id, newAppointment);
    return newAppointment;
}

/**
 * Updates an existing appointment's information.
 * @param {string} id - The ID of the appointment to update.
 * @param {Appointment} updatedAppointment - The updated appointment object.
 * @returns {Appointment | null} The updated appointment object if successful, null if appointment wasn't found.
*/

export const updateAppointment = (id: string, updatedAppointment: Appointment): Appointment | null => {
    if(!appointments.has(id)) {
        console.error("Appointment with id ", id, " not found");
        return null;
    }

    appointments.set(id, updatedAppointment);
    return updatedAppointment;
}

/**
 * Deletes a appointment from the system.
 * @param {string} id - The ID of the appointment to delete.
 * @returns {boolean} True if the appointment was successfully deleted, false if appointment wasn't found.
*/

export const deleteAppointment = (id: string): boolean => {
    if (!appointments.has(id)) {
        console.error("Appointment with id ", id, " not found");
        return false;
    }

    appointments.delete(id);
    return true;
}

