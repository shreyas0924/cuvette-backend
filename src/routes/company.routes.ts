import express from "express";
import { validateRequest } from "../services/middleware";
import {
  companyLoginSchema,
  companyRegistrationSchema,
} from "../schema/company.schema";
import {
  registerCompany,
  verifyEmail,
  verifyPhone,
} from "../controller/company.controller";

export const router = express.Router();

router.post(
  "/register",
  validateRequest(companyRegistrationSchema),
  registerCompany
);
// router.post("/login", validateRequest(companyLoginSchema), loginCompany);

router.get("/verifyEmail", verifyEmail);
router.get("/verifyPhone", verifyPhone);
