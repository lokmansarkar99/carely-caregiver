/** Types of documents a caregiver must upload */
export enum DOCUMENT_TYPE {
  GOVERNMENT_ID   = 'government_id',
  NURSING_CERT    = 'nursing_cert',
  CRIMINAL_RECORD = 'criminal_record',
  INSURANCE       = 'insurance',
}

/** Admin verification status per document */
export enum DOCUMENT_STATUS {
  PENDING  = 'pending',  // Uploaded, awaiting admin review
  VERIFIED = 'verified', // Admin approved
  REJECTED = 'rejected', // Admin rejected with reason
}