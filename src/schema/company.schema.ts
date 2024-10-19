import { z } from "zod";

export const companyRegistrationSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/),
});

export const companyLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
