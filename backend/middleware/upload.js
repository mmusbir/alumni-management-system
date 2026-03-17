const multer = require('multer');

const IMAGE_FILE_SIZE_LIMIT = 1_250_000;
const CSV_FILE_SIZE_LIMIT = 4 * 1024 * 1024;

const memoryStorage = multer.memoryStorage();

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
  const isCsvExt = (file.originalname || '').toLowerCase().endsWith('.csv');
  if (!isCsvMime && !isCsvExt) {
    cb(new Error('File import harus berformat CSV'));
    return;
  }
  cb(null, true);
}

const uploadSiteAssets = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: IMAGE_FILE_SIZE_LIMIT },
});

const uploadCsv = multer({
  storage: memoryStorage,
  fileFilter: csvFilter,
  limits: { fileSize: CSV_FILE_SIZE_LIMIT },
});

module.exports = {
  uploadSiteAssets,
  uploadCsv,
};
