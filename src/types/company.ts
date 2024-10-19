import { ObjectId } from "mongodb";

export interface Company {
  _id?: ObjectId;
  name: string;
  companyName: string;
  email: string;
  password: string;
  phone: string;
  employeeSize: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  verificationToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
