import { Request } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import ApiError from '../../errors/ApiErrors';

// ── Field → folder map (must match shared/getFilePath.ts) 
const FIELD_FOLDER_MAP: Record<string, string> = {
  profileImage:   'user',
  careRecipientPhoto:  'care-recipients', 
  governmentId:   'documents',
  nursingCert:    'documents',
  criminalRecord: 'documents',
  insurance:      'documents',
  attachment:     'attachments',
  icon:           'category',
};

// ── Per-field size limits (bytes) 
const FIELD_SIZE_LIMIT: Record<string, number> = {
  profileImage:   2  * 1024 * 1024,  // 2 MB
   careRecipientPhoto:  2  * 1024 * 1024,
  governmentId:   10 * 1024 * 1024,  // 10 MB
  nursingCert:    10 * 1024 * 1024,  // 10 MB
  criminalRecord: 10 * 1024 * 1024,  // 10 MB
  insurance:      10 * 1024 * 1024,  // 10 MB
  attachment:     20 * 1024 * 1024,  // 20 MB
  icon:           2  * 1024 * 1024,  // 2 MB
};

// ── Allowed MIME types per field 
const IMAGE_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const DOC_MIMES   = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const ALL_ATTACH  = [...IMAGE_MIMES, 'application/pdf', 'video/mp4', 'video/quicktime'];

const FIELD_MIME_MAP: Record<string, string[]> = {
  profileImage:   IMAGE_MIMES,
   careRecipientPhoto:  IMAGE_MIMES,
  governmentId:   DOC_MIMES,
  nursingCert:    DOC_MIMES,
  criminalRecord: DOC_MIMES,
  insurance:      DOC_MIMES,
  attachment:     ALL_ATTACH,
  icon:           IMAGE_MIMES,
};

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const fileUploadHandler = (() => {
  const base = path.join(process.cwd(), 'uploads');
  ensureDir(base);
  // Pre-create sub-folders
  ['user', 'documents', 'attachments'].forEach((f) => ensureDir(path.join(base, f)));

  const storage = multer.diskStorage({
    destination: (_req, file, cb) => {
      const folder = FIELD_FOLDER_MAP[file.fieldname] ?? 'misc';
      const dest   = path.join(base, folder);
      ensureDir(dest);
      cb(null, dest);
    },
    filename: (_req, file, cb) => {
      const ext  = path.extname(file.originalname).toLowerCase();
      const name = `${file.fieldname}-${Date.now()}${ext}`;
      cb(null, name);
    },
  });

  const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    const allowed = FIELD_MIME_MAP[file.fieldname];
    if (!allowed) {
      return cb(new ApiError(StatusCodes.BAD_REQUEST, `Unknown upload field: ${file.fieldname}`));
    }
    if (!allowed.includes(file.mimetype)) {
      return cb(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          `Invalid file type for "${file.fieldname}". Allowed: ${allowed.join(', ')}`,
        ),
      );
    }
    // Per-field size check (multer limits is a global cap — this is field-level)
    const maxSize = FIELD_SIZE_LIMIT[file.fieldname] ?? 10 * 1024 * 1024;
    (file as any).sizeLimit = maxSize;
    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 }, 
  }).fields([
    { name: 'profileImage',   maxCount: 1 },
    { name: 'careRecipientPhoto', maxCount: 1 },
    { name: 'governmentId',   maxCount: 1 },
    { name: 'nursingCert',    maxCount: 1 },
    { name: 'criminalRecord', maxCount: 1 },
    { name: 'insurance',      maxCount: 1 },
    { name: 'attachment',     maxCount: 5 },
    { name: 'icon',           maxCount: 1 },
  ]);
})();

export default fileUploadHandler;