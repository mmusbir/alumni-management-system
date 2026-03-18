const UsahaModel = require('../models/usahaModel');

const usahaController = {
  /**
   * GET /api/usaha
   * List all businesses with optional category and search filters.
   */
  async getUsaha(req, res) {
    try {
      const { page = 1, kategori, search } = req.query;
      const result = await UsahaModel.findAll({
        page: parseInt(page, 10) || 1,
        kategori,
        search,
      });

      return res.json({
        success: true,
        ...result,
      });
    } catch (err) {
      console.error('Get usaha error:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
      });
    }
  },

  /**
   * POST /api/usaha
   * Create a new business listing.
   */
  async createUsaha(req, res) {
    try {
      const id = await UsahaModel.create({
        ...req.body,
        phone_usaha: req.body.phone_usaha || req.body.phone,
      });

      return res.status(201).json({
        success: true,
        message: 'Usaha berhasil didaftarkan',
        data: { id },
      });
    } catch (err) {
      console.error('Create usaha error:', err);

      // Handle FK constraint error (invalid pemilik_id)
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
          success: false,
          message: 'Pemilik ID tidak ditemukan',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
      });
    }
  },
};

module.exports = usahaController;
