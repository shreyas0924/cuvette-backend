import express from "express";
import { authenticate, validateRequest } from "../services/middleware";
import { createJobSchema } from "../schema/job.schema";
import { createJob } from "../controller/job.controller";

export const router = express.Router();

router.post("/", authenticate, validateRequest(createJobSchema), createJob);
