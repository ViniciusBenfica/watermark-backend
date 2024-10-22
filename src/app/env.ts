import { z } from "zod";

const envSchema = z.object({
	SERVER_PORT: z.string(),
	STRIPE_SECRET_KEY: z.string(),
	TOKEN_EXPIRE_TIME: z.string(),
	JWT_TOKEN: z.string(),
});

export const env = envSchema.parse(process.env);
