export const config = {
    jwtSecret: process.env.JWT_SECRET as string || "My_secret_key",
    port: process.env.PORT as string || 4001
}

export default config;
