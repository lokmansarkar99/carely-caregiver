import { Schema, model } from "mongoose";
import { ICareRecipient } from "./care-recipient.interface";

const CareRecipientSchema = new Schema<ICareRecipient>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      default: null,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: null,
    },
    relationship: {
      type: String,
      required: true,
      trim: true,
    },
    primaryLanguage: {
      type: String,
      enum: ["English", "Spanish", "Other"],
      default: "English",
    },
    medicalConditions: {
      type: String,
      default: null,
    },
    allergies: {
      type: String,
      default: null,
    },
    mobilityStatus: {
      type: String,
      enum: ["Independent", "Walker", "Wheelchair", "Bedridden", "Other"],
      default: null,
    },
    careNeeds: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const CareRecipient = model<ICareRecipient>(
  "CareRecipient",
  CareRecipientSchema,
);

export default CareRecipient;
