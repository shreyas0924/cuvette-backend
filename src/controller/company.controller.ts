// src/controllers/company.controller.ts
import { Request, Response } from "express";
import { getDb } from "../config/db";
import { Company } from "../types/company";
import { generateToken, hashPassword, verifyPassword } from "../services/auth";
import { sendVerificationEmail } from "../services/email";
import crypto from "crypto";

export const registerCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = getDb();
    const { name, email, phone, companyName, employeeSize } = req.body;

    // Check if company already exists
    const existingCompany = await db.collection("companies").findOne({ email });
    if (existingCompany) {
      res.status(400).json({ error: "Email already registered" });
      return; // Stop execution after sending response
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const company: Company = {
      name,
      email,
      companyName,
      employeeSize,
      phone,
      isEmailVerified: false,
      isPhoneVerified: false,
      verificationToken,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the company into the database
    const result = await db.collection("companies").insertOne(company);

    // Try to send verification email
    const emailSent = await sendVerificationEmail(email, verificationToken);
    if (!emailSent) {
      // Delete the company record if email sending fails
      await db.collection("companies").deleteOne({ _id: result.insertedId });

      res.status(500).json({
        error:
          "Failed to send verification email. Please try registering again.",
      });
      return;
    }

    res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
      companyId: result.insertedId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Error registering company" });
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      res.status(400).json({ error: "Invalid verification token" });
      return;
    }

    const db = getDb();
    const result = await db.collection("companies").updateOne(
      { verificationToken: token },
      {
        $set: {
          isEmailVerified: true,
          verificationToken: null,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      res.status(400).json({ error: "Invalid or expired verification token" });
      return;
    }

    res.json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Error verifying email" });
  }
};

export const verifyPhone = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { otp } = req.query;

    if (!otp || typeof otp !== "string") {
      res.status(400).json({ error: "Invalid OTP" });
      return;
    }

    const db = getDb();
    const result = await db.collection("companies").updateOne(
      {},
      {
        $set: {
          isPhoneVerified: true,
          phoneOTP: null,
          updatedAt: new Date(),
        },
      }
    );
    if (result.matchedCount === 0) {
      res.status(400).json({ error: "Invalid or expired OTP" });
      return;
    }

    res.json({ message: "Phone verified successfully." });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Error verifying phone" });
  }
};

export const loginCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const db = getDb();
    const company = await db.collection("companies").findOne({ email });

    if (!company) {
      res.status(404).json({ error: "Company not found" });
      return;
    }

    // Verify the password
    const passwordValid = await verifyPassword(password, company.password);

    if (!passwordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate JWT for the company
    const token = generateToken(company._id);

    // Return token in response
    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
