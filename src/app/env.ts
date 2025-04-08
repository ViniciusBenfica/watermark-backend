import { z } from "zod";

const envSchema = z.object({
	SERVER_PORT: z.string(),
	STRIPE_SECRET_KEY: z.string(),
	STRIPE_WEBHOOK_SECRET: z.string(),
	DATABASE_URL: z.string(),
	FRONTEND_URL: z.string(),
	JWT_TOKEN: z.string(),
});

export const env = envSchema.parse(process.env);
