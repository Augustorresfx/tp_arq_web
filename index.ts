import cors from "cors";
import { createServer } from "http";
import { authRouter, barberRouter, appointmentRouter } from "./routes";
import config from "./config";
const corsMiddleware = cors();

const server = createServer(async (req, res) => {
    console.log("📥 Nueva petición recibida:", req.method, req.url);
    corsMiddleware(req, res, async () => {
        res.setHeader("Content-Type", "application/json");

        try {
            if (req.url?.startsWith("/auth")) {
                await authRouter(req, res);
            } else if (req.url?.startsWith("/barber")) {
                await barberRouter(req, res);
            } else if (req.url?.startsWith("/appointment")) {
                await appointmentRouter(req, res);
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: "Endpoint not found"}));
            }
        } catch(_err) {
            res.statusCode = 500;
            console.log(_err);
            res.end(JSON.stringify({ message: "Internal Server Error"}));
        }
    })
})

server.listen(config.port, () => {
    console.log("Server running on port ", config.port);
})