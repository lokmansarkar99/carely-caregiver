import { Document, Model, Types } from 'mongoose';
import { DOCUMENT_TYPE, DOCUMENT_STATUS } from '../../../enums/document';

export type ICaregiverDocument = {
  caregiver: Types.ObjectId;
  documentType: DOCUMENT_TYPE;
  fileUrl: string;
  fileName: string;
  status: DOCUMENT_STATUS;
  rejectionReason: string | null;
  verifiedAt: Date | null;
  verifiedBy: Types.ObjectId | null;
};

export type ICaregiverDocumentDocument = ICaregiverDocument & Document;
export type ICaregiverDocumentModel = Model<ICaregiverDocumentDocument>;