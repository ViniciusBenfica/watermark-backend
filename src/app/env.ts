import { z } from 'zod';

const envSchema = z.object({
  SERVER_PORT: z.string()
});

export const env = envSchema.parse(process.env);
