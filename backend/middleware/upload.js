const fs = require('fs');
const path = require('path');
const multer = require('multer');

const frontendRoot = path.join(__dirname, '../../frontend');
const uploadRoot = path.join(frontendRoot, 'uploads');
const siteSettingsDir = path.join(uploadRoot, 'site-settings');
const importsDir = path.join(uploadRoot, 'imports');

[uploadRoot, siteSettingsDir, importsDir].forEach((dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

function buildFileName(file) {
  const ext = path.extname(file.originalname || '').toLowerCase();
  const safeBase = path.basename(file.originalname || 'file', ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'file';
  return `${Date.now()}-${safeBase}${ext}`;
}

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, siteSettingsDir),
  filename: (_req, file, cb) => cb(null, buildFileName(file)),
});

const csvStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, importsDir),
  filename: (_req, file, cb) => cb(null, buildFileName(file)),
});

function imageFilter(_req, file, cb) {
  const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
  if (!allowed.includes(file.mimetype)) {
    cb(new Error('File gambar harus berformat PNG atau JPG'));
    return;
  }
  cb(null, true);
}

function csvFilter(_req, file, cb) {
  const isCsvMime = [
    'text/csv',
    'application/csv',
    'application/vnd.ms-excel',
    'text/plain',
  ].includes(file.mimetype);
  const isCsvExt = path.extname(file.originalname || '').toLowerCase() === '.csv';
  if (!isCsvMime && !isCsvExt) {
    cb(new Error('File import harus berformat CSV'));
    return;
  }
  cb(null, true);
}

const uploadSiteAssets = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadCsv = multer({
  storage: csvStorage,
  fileFilter: csvFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = {
  uploadSiteAssets,
  uploadCsv,
};
