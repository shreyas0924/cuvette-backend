import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { ObjectId } from "mongodb";
import { AnyZodObject, ZodError } from "zod";

export interface AuthRequest extends Request {
  companyId?: ObjectId;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("JWT token:", token);
    if (!token) {
      res.status(401).json({ error: "Authentication required" });
      return; // Ensure the response terminates the function execution
    }

    const decoded = jwt.verify(token, config.jwtSecret) as {
      companyId: string;
    };
    req.companyId = new ObjectId(decoded.companyId);
    next(); // Continue to the next middleware or controller
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const validateRequest = (schema: AnyZodObject) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData;
      next(); // If validation is successful, continue to the next middleware
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: "error",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
        return; // Terminate execution if validation fails
      }
      res.status(500).json({
        status: "error",
        message: "Internal server error during validation",
      });
    }
  };
};
