import { ObjectId } from "mongodb";

export interface Company {
  _id?: ObjectId;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  employeeSize: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  verificationToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
