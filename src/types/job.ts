import { ObjectId } from "mongodb";

export interface Job {
  _id?: ObjectId;
  companyId: ObjectId;
  title: string;
  description: string;
  experienceLevel: string;
  candidates: string[];
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
