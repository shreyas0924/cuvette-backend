import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  experienceLevel: z.string(),
  candidates: z.array(z.string().email()),
  endDate: z.string().transform((str) => new Date(str)),
});
