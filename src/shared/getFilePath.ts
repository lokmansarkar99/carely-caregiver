/**
 * Field-to-folder map for Carely local uploads.
 * All paths relative to /uploads/
 */
const FIELD_TO_FOLDER: Record<string, string> = {
  profileImage:   'user',        // Profile avatar — all roles
  governmentId:   'documents',   // Caregiver: govt-issued ID
  nursingCert:    'documents',   // Caregiver: nursing certificate
  criminalRecord: 'documents',   // Caregiver: criminal record check
  insurance:      'documents',   // Caregiver: insurance certificate
  attachment:     'attachments', // Messaging file attachments
  icon: 'category',     // Service category icons
};

export type IFolderName =
  | 'profileImage'
  | 'governmentId'
  | 'nursingCert'
  | 'criminalRecord'
  | 'insurance'
  | 'attachment'
  | 'icon';

/**
 * Returns the relative path for a SINGLE uploaded file.
 * Example return: "documents/nursingCert-1712503200000.pdf"
 */
export const getSingleFilePath = (
  files:     any,
  fieldName: IFolderName,
): string | undefined => {
  const fileField = files?.[fieldName];
  if (Array.isArray(fileField) && fileField.length > 0) {
    const folder = FIELD_TO_FOLDER[fieldName] ?? fieldName;
    return `${folder}/${fileField[0].filename}`;
  }
  return undefined;
};

/**
 * Returns array of relative paths for MULTIPLE uploaded files.
 * Example: ["attachments/file1.pdf", "attachments/img.jpg"]
 */
export const getMultipleFilesPath = (
  files:     any,
  fieldName: IFolderName,
): string[] | undefined => {
  const fileField = files?.[fieldName];
  if (Array.isArray(fileField) && fileField.length > 0) {
    const folder = FIELD_TO_FOLDER[fieldName] ?? fieldName;
    return fileField.map((f: Express.Multer.File) => `${folder}/${f.filename}`);
  }
  return undefined;
};

// ─── Usage Guide ──────────────────────────────────────────────────────────────
// const avatar      = getSingleFilePath(req.files, 'profileImage');
// const govId       = getSingleFilePath(req.files, 'governmentId');
// const nursing     = getSingleFilePath(req.files, 'nursingCert');
// const criminal    = getSingleFilePath(req.files, 'criminalRecord');
// const insurance   = getSingleFilePath(req.files, 'insurance');
// const attachments = getMultipleFilesPath(req.files, 'attachment');