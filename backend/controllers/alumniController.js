const AlumniModel = require('../models/alumniModel');
const UsahaModel = require('../models/usahaModel');
const { sendConfirmationEmail } = require('../config/mailer');

const alumniController = {
  /**
   * POST /api/register
   * Register a new alumni. Also creates usaha entry if punya_usaha is true.
   * Sends a confirmation email on success.
   */
  async register(req, res) {
    try {
      const data = req.body;

      // Check email uniqueness
      const existingEmail = await AlumniModel.findByEmail(data.email);
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: 'Email sudah terdaftar',
        });
      }

      // Check phone uniqueness
      const existingPhone = await AlumniModel.findByPhone(data.phone);
      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message: 'No. HP sudah terdaftar',
        });
      }

      // Insert alumni
      const alumniId = await AlumniModel.create({
        ...data,
        is_verified: false,
        verified_at: null,
      });

      // If alumni has a business, also insert into usaha table
      if (data.punya_usaha && data.nama_usaha && data.kategori_usaha) {
        await UsahaModel.create({
          nama_usaha: data.nama_usaha,
          kategori: data.kategori_usaha,
          pemilik_id: alumniId,
          is_verified: false,
          verified_at: null,
        });
      }

      // Send confirmation email (non-blocking — don't fail registration if email fails)
      sendConfirmationEmail(data.email, data.nama).catch((err) => {
        console.error('Email confirmation failed:', err.message);
      });

      return res.status(201).json({
        success: true,
        message: 'Pendaftaran berhasil dan menunggu verifikasi admin. Email konfirmasi telah dikirim.',
        data: { id: alumniId },
      });
    } catch (err) {
      console.error('Register error:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
      });
    }
  },

  /**
   * GET /api/alumni
   * List alumni with pagination and optional filters.
   */
  async getAlumni(req, res) {
    try {
      const { page = 1, angkatan, profesi, search } = req.query;
      const result = await AlumniModel.findAll({
        page: parseInt(page, 10) || 1,
        angkatan,
        profesi,
        search,
      });

      return res.json({
        success: true,
        ...result,
      });
    } catch (err) {
      console.error('Get alumni error:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
      });
    }
  },
};

module.exports = alumniController;
