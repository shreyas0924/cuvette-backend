import { ObjectId } from "mongodb";

export interface Company {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  verificationToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
