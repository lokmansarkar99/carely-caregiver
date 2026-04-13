import { Types } from "mongoose";

export type TGender = "Male" | "Female" | "Other";
export type TPrimaryLanguage = "English" | "Spanish" | "Other";
export type TMobilityStatus =
  | "Independent"
  | "Walker"
  | "Wheelchair"
  | "Bedridden"
  | "Other";

export interface ICareRecipient {
  _id?: Types.ObjectId;
  client: Types.ObjectId;
  fullName: string;
  photo?: string;
  dateOfBirth?: Date;
  gender?: TGender;
  relationship: string;
  primaryLanguage?: TPrimaryLanguage;
  medicalConditions?: string;
  allergies?: string;
  mobilityStatus?: TMobilityStatus;
  careNeeds?: string[];
  notes?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
