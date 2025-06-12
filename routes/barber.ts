import type { IncomingMessage, ServerResponse } from "http";
import { authenticateToken, type AuthenticatedRequest } from "../middleware/authentication";
import { addBarber, barberSchema, deleteBarber, getAllBarbers, getAppointmentsByBarberId, getBarberById, HttpMethod, Role, updateBarber, type Barber } from "../models";
import { authorizeRoles } from "../middleware/authorization";
import { parseBody } from "../utils/parseBody";
import { safeParse } from "valibot";

export const barberRouter = async (
    req: IncomingMessage,
    res: ServerResponse
) => {
    const { method, url } = req;

    if (!await authenticateToken(req as AuthenticatedRequest, res)) {
        res.statusCode = 401,
        res.end(JSON.stringify({ message: "Unauthorized"}));    
        return;
    }

    if (url === "/barber" && method === HttpMethod.GET ) {
        const barbers = getAllBarbers();

        res.statusCode = 200;
        res.end(JSON.stringify(barbers));
        return;
    }

    if (url === "/barber/" && method === HttpMethod.GET) {
        const id = url.split("/").pop() as string;
        const barber = getBarberById(id);
        
        if (!barber) {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: "Barber not found" }));
            return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify(barber));
        return;
    }

    if (url?.startsWith("/barber/") && method === HttpMethod.GET) {
        const parts = url.split("/").filter(Boolean); // elimina cualquier elemento vacio como ""
        // ["", "barber", "123", "appointments"]
        // ["barber", "123", "appointments"]
        if (parts.length === 3 && parts[2] === "appointment" && parts[1]) {
            const id = parts[1] as string;
            const appointments = getAppointmentsByBarberId(id);
            res.statusCode = 200;  
            res.end(JSON.stringify(appointments));
            return;
        }

        if (parts.length === 2) {
            const id = parts[1] as string;
            const barber = getBarberById(id);

            if (!barber) {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: "Barber not found" }));
                return;
            }

            res.statusCode = 200;
            res.end(JSON.stringify(barber));
            return;
        }
    }

    if (url === "/barber" && method === HttpMethod.POST) {
        if (!(await authorizeRoles(Role.ADMIN, Role.USER)(req as AuthenticatedRequest, res))) {
            res.statusCode = 403;
            res.end(JSON.stringify({ message: "Forbidden" }));
            return;
        }

        const body = await parseBody(req);
        const { output, issues } = safeParse(barberSchema, body);

        if (issues) {
            res.statusCode = 400;
            res.end(JSON.stringify({ message: issues }));
            return;
        }

        const barber: Barber = addBarber(output);

        res.statusCode = 201;
        res.end(JSON.stringify({barber}));
        return;
    }

    if (url?.startsWith("/barber/") && method === HttpMethod.PATCH ) {
        if (!(await authorizeRoles(Role.ADMIN, Role.USER)(req as AuthenticatedRequest, res))){ 
            res.statusCode = 403;
            res.end(JSON.stringify({ message: "Forbidden" }));
            return;
        }
        
        const id = url.split("/").pop() as string;
        const body = await parseBody(req);
        const barber: Barber = body;
        const updatedBarber = updateBarber(id, barber);

        if(!updatedBarber) {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: "Barber not found" }));
            return;
        } else {
            res.statusCode = 200;
            res.end(JSON.stringify(updatedBarber));
        }

        return;
    }

    if (url?.startsWith("/barber/") && method === HttpMethod.DELETE) {
        if(!(await authorizeRoles(Role.ADMIN, Role.USER)(req as AuthenticatedRequest, res))) {
            res.statusCode = 403;
            res.end(JSON.stringify({ message: "Forbidden" }));
            return;
        }

        const id = url.split("/").pop() as string;
        const success = deleteBarber(id);

        if (!success) {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: "Barber not found" }));
            return;
        }   else {
            res.statusCode = 204;
            res.end(JSON.stringify({ message: "Barber deleted "}));

        }

        return;
    }
}