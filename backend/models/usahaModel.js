const db = require('../config/db');

const ITEMS_PER_PAGE = 12;

const UsahaModel = {
  /**
   * Insert a new usaha record.
   */
  async create(data) {
    const isVerified = data.is_verified === undefined ? 1 : (data.is_verified ? 1 : 0);
    const verifiedAt = isVerified ? (data.verified_at || new Date()) : null;
    const sql = `
      INSERT INTO usaha (nama_usaha, kategori, pemilik_id, is_verified, verified_at)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      data.nama_usaha,
      data.kategori,
      data.pemilik_id,
      isVerified,
      verifiedAt,
    ]);
    return result.insertId;
  },

  /**
   * List usaha with optional category and search filters, joined with alumni for owner name.
   */
  async findAll({ page = 1, kategori, search } = {}) {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const conditions = ['u.is_verified = 1', 'a.is_verified = 1'];
    const params = [];

    if (kategori) {
      conditions.push('u.kategori = ?');
      params.push(kategori);
    }

    if (search) {
      conditions.push('(u.nama_usaha LIKE ? OR a.nama LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [countRows] = await db.execute(
      `SELECT COUNT(*) AS total
       FROM usaha u
       JOIN alumni a ON a.id = u.pemilik_id
       ${where}`,
      params,
    );
    const total = countRows[0].total;

    const [rows] = await db.execute(
      `SELECT u.id, u.nama_usaha, u.kategori, u.pemilik_id,
              a.nama AS pemilik, u.created_at
       FROM usaha u
       JOIN alumni a ON a.id = u.pemilik_id
       ${where}
       ORDER BY u.created_at DESC
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

module.exports = UsahaModel;
