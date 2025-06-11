import type { IncomingMessage, ServerResponse } from "http";
import { authenticateToken, type AuthenticatedRequest } from "../middleware/authentication";
import { addAppointment, appointmentSchema, deleteAppointment, getAllAppointments, getAppointmentById, HttpMethod, Role, updateAppointment, type Appointment } from "../models";
import { authorizeRoles } from "../middleware/authorization";
import { parseBody } from "../utils/parseBody";
import { safeParse } from "valibot";

export const appointmentRouter = async (
    req: IncomingMessage,
    res: ServerResponse
) => {
    const { method, url } = req;

    if (!await authenticateToken(req as AuthenticatedRequest, res)) {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: "Unauthorized" }));
        return;
    }

    if (url === "/appointment" && method === HttpMethod.GET) {
        const appointments = getAllAppointments();

        res.statusCode = 200;
        res.end(JSON.stringify(appointments));
        return;
    }

    if (url == "/appointment/" && method === HttpMethod.GET) {
        const id = url.split("/").pop() as string;
        const appointment = getAppointmentById(id);

        if (!appointment) {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: "Appointment not found" }));
            return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify(appointment));
    }

    if (url === "/appointment" && method === HttpMethod.POST) {
        if (!(await authorizeRoles(Role.ADMIN, Role.USER)(req as AuthenticatedRequest, res))) {
            res.statusCode = 403;
            res.end(JSON.stringify({ message: "Forbidden" }));
            return;
        }

        const body = await parseBody(req);
        const { output, issues } = safeParse(appointmentSchema, body);

        if (issues) {
            res.statusCode = 400;
            res.end(JSON.stringify({ message: issues }));
            return;
        }

        const appointment: Appointment = addAppointment(output);

        res.statusCode = 201;
        res.end(JSON.stringify({appointment}))
        return;
    }

    if (url?.startsWith("/appointment/") && method === HttpMethod.PATCH) {
        if(!(await authorizeRoles(Role.ADMIN, Role.USER)(req as AuthenticatedRequest, res))) {
            res.statusCode = 403;
            res.end(JSON.stringify({ message: "Forbidden" }));
            return;
        }

        const id = url.split("/").pop() as string;
        const body = await parseBody(req);
        const appointment: Appointment = body;
        const updatedAppointment = updateAppointment(id, appointment);

        if (!updatedAppointment) {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: "Appointment not found" }));
            return;
        } else {
            res.statusCode = 200;
            res.end(JSON.stringify(updatedAppointment));
        }

        return;
    }

    if (url?.startsWith("/appointment/") && method === HttpMethod.DELETE) {
        if(!(await authorizeRoles(Role.ADMIN, Role.USER)(req as AuthenticatedRequest, res))) {
            res.statusCode = 403;
            res.end(JSON.stringify({ message: "Forbidden" }));
            return;
        }

        const id = url.split("/").pop() as string;
        const success = deleteAppointment(id);

        if (!success) {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: "Appointment not found" }));
            return;
        } else {
            res.statusCode = 200;
            res.end(JSON.stringify({ message: "Appointment deleted" }));
        }

        return;
    }
}