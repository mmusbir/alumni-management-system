const db = require('../config/db');

const ITEMS_PER_PAGE = 12;

const AlumniModel = {
  /**
   * Insert a new alumni record.
   * Returns the insertId.
   */
  async create(data) {
    const isVerified = data.is_verified === undefined ? 1 : (data.is_verified ? 1 : 0);
    const verifiedAt = isVerified ? (data.verified_at || new Date()) : null;
    const sql = `
      INSERT INTO alumni
        (nama, angkatan, tempat_lahir, tanggal_lahir, gender,
         email, phone, profesi, punya_usaha, nama_usaha,
         kategori_usaha, provinsi, kota, alamat, is_verified, verified_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.nama,
      data.angkatan,
      data.tempat_lahir || null,
      data.tanggal_lahir || null,
      data.gender,
      data.email,
      data.phone,
      data.profesi || null,
      data.punya_usaha ? 1 : 0,
      data.nama_usaha || null,
      data.kategori_usaha || null,
      data.provinsi || null,
      data.kota || null,
      data.alamat || null,
      isVerified,
      verifiedAt,
    ];
    const [result] = await db.execute(sql, params);
    return result.insertId;
  },

  /**
   * Check if an email already exists.
   */
  async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT id FROM alumni WHERE email = ? LIMIT 1',
      [email],
    );
    return rows[0] || null;
  },

  /**
   * Check if a phone already exists.
   */
  async findByPhone(phone) {
    const [rows] = await db.execute(
      'SELECT id FROM alumni WHERE phone = ? LIMIT 1',
      [phone],
    );
    return rows[0] || null;
  },

  /**
   * List alumni with pagination, search, and filters.
   * Returns { data, total, page, totalPages }.
   */
  async findAll({ page = 1, angkatan, profesi, search } = {}) {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const conditions = ['is_verified = 1'];
    const params = [];

    if (angkatan) {
      conditions.push('angkatan = ?');
      params.push(angkatan);
    }
    if (profesi) {
      conditions.push('profesi = ?');
      params.push(profesi);
    }
    if (search) {
      conditions.push('(nama LIKE ? OR kota LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // Total count
    const [countRows] = await db.execute(
      `SELECT COUNT(*) AS total FROM alumni ${where}`,
      params,
    );
    const total = countRows[0].total;

    // Data
    const [rows] = await db.execute(
      `SELECT id, nama, angkatan, kota, profesi, created_at
       FROM alumni ${where}
       ORDER BY created_at DESC
       LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`,
      params,
    );

    return {
      data: rows,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    };
  },
};

module.exports = AlumniModel;
