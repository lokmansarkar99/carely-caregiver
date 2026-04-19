import { Schema, model } from 'mongoose';
import { ICaregiverDocumentDocument, ICaregiverDocumentModel } from './document.interface';
import { DOCUMENT_TYPE, DOCUMENT_STATUS } from '../../../enums/document';

const caregiverDocumentSchema = new Schema<ICaregiverDocumentDocument>(
  {
    caregiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    documentType: {
      type: String,
      enum: Object.values(DOCUMENT_TYPE),
      required: true,
    },

    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },

    status: {
      type: String,
      enum: Object.values(DOCUMENT_STATUS),
      default: DOCUMENT_STATUS.PENDING,
    },

    rejectionReason: { type: String, default: null },
    verifiedAt: { type: Date, default: null },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true },
);

// One document per type per caregiver enforced at DB level
caregiverDocumentSchema.index({ caregiver: 1, documentType: 1 }, { unique: true });
caregiverDocumentSchema.index({ status: 1 });
caregiverDocumentSchema.index({ caregiver: 1, status: 1 });

export const CaregiverDocument = model<ICaregiverDocumentDocument, ICaregiverDocumentModel>(
  'CaregiverDocument',
  caregiverDocumentSchema,
);