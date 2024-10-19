import { Request, Response } from "express";
import { getDb } from "../config/db";
import { Job } from "../types/job";
import { sendJobAlert } from "../services/email";
import { ObjectId } from "mongodb";
import { AuthRequest } from "../services/middleware";

export const createJob = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const db = getDb();
    const companyId = req.companyId;

    // Ensure the company exists and is verified
    const company = await db
      .collection("companies")
      .findOne({ _id: companyId, isEmailVerified: true });

    if (!company) {
      res.status(403).json({ error: "Company not verified" });
      return; // Terminate further execution after sending the response
    }

    // Create a job object
    const job: Job = {
      companyId: companyId!,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the job into the database
    const result = await db.collection<Job>("jobs").insertOne(job);

    // Send email to candidates if they exist
    if (job.candidates && job.candidates.length > 0) {
      await sendJobAlert(job.candidates, job);
    }

    // Send success response with job details
    res.status(201).json({ ...job, _id: result.insertedId });
  } catch (error) {
    // Send a generic server error response
    res.status(500).json({ error: "Error creating job posting" });
  }
};
