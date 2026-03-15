const { body, validationResult } = require('express-validator');

/**
 * Middleware that checks express-validator results
 * and sends 422 with error details if any field fails.
 */
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validasi gagal',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
}

/**
 * Validation rules for POST /api/register
 */
const validateRegister = [
  body('nama')
    .trim()
    .notEmpty().withMessage('Nama wajib diisi')
    .isLength({ max: 150 }).withMessage('Nama maksimal 150 karakter'),

  body('angkatan')
    .trim()
    .notEmpty().withMessage('Angkatan wajib diisi'),

  body('gender')
    .trim()
    .isIn(['Laki-laki', 'Perempuan']).withMessage('Gender harus Laki-laki atau Perempuan'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty().withMessage('No. HP wajib diisi')
    .matches(/^[0-9+\-\s]{8,20}$/).withMessage('Format no. HP tidak valid'),

  body('profesi')
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body('tempat_lahir')
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body('tanggal_lahir')
    .optional()
    .isISO8601().withMessage('Format tanggal tidak valid (YYYY-MM-DD)'),

  body('provinsi')
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body('kota')
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body('alamat')
    .optional()
    .trim(),

  body('punya_usaha')
    .optional()
    .isBoolean(),

  body('nama_usaha')
    .optional()
    .trim()
    .isLength({ max: 150 }),

  body('kategori_usaha')
    .optional()
    .trim()
    .isLength({ max: 100 }),

  handleValidation,
];

/**
 * Validation rules for POST /api/usaha
 */
const validateUsaha = [
  body('nama_usaha')
    .trim()
    .notEmpty().withMessage('Nama usaha wajib diisi')
    .isLength({ max: 150 }),

  body('kategori')
    .trim()
    .notEmpty().withMessage('Kategori wajib diisi')
    .isLength({ max: 100 }),

  body('pemilik_id')
    .notEmpty().withMessage('Pemilik ID wajib diisi')
    .isInt({ gt: 0 }).withMessage('Pemilik ID harus angka positif'),

  handleValidation,
];

/**
 * Validation rules for POST /api/admin/login
 */
const validateAdminLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password wajib diisi')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),

  handleValidation,
];

module.exports = { validateRegister, validateUsaha, validateAdminLogin };
