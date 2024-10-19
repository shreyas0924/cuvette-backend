import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../config/config";
import { getDb } from "../config/db";
import { Company } from "../types/company";
import { ObjectId } from "mongodb";

export const generateToken = (companyId: ObjectId): string => {
  return jwt.sign({ companyId }, config.jwtSecret, { expiresIn: "24h" });
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
