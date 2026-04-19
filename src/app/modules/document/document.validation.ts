import { z } from 'zod';
import { DOCUMENT_TYPE, DOCUMENT_STATUS } from '../../../enums/document';
import { checkValidID } from '../../../shared/chackValid';

const documentIdParam = z.object({
  params: z.object({
    id: checkValidID('Document ID'),
  }),
});

const uploadDocumentSchema = z.object({
  body: z.object({
    documentType: z.nativeEnum(DOCUMENT_TYPE, { message: 'Invalid document type' }),
  }),
});

const rejectDocumentSchema = z.object({
  params: z.object({
    id: checkValidID('Document ID'),
  }),
  body: z.object({
    rejectionReason: z
      .string()
      .min(5, 'Rejection reason must be at least 5 characters'),
  }),
});

const adminGetDocumentsSchema = z.object({
  query: z.object({
    status: z.nativeEnum(DOCUMENT_STATUS).optional(),
    documentType: z.nativeEnum(DOCUMENT_TYPE).optional(),
    caregiverId: z.string().optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).optional(),
  }),
});

export const DocumentValidation = {
  uploadDocumentSchema,
  documentIdParam,
  rejectDocumentSchema,
  adminGetDocumentsSchema,
};