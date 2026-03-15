const db = require('./db');
const { hashPassword } = require('../utils/auth');

async function createAdminTables() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(150) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_admin_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      admin_id INT NOT NULL,
      token_hash CHAR(64) NOT NULL,
      user_agent VARCHAR(255) DEFAULT NULL,
      ip_address VARCHAR(45) DEFAULT NULL,
      expires_at DATETIME NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_admin_token_hash (token_hash),
      KEY idx_admin_session_admin_id (admin_id),
      KEY idx_admin_session_expires (expires_at),
      CONSTRAINT fk_admin_sessions_admin_users
        FOREIGN KEY (admin_id) REFERENCES admin_users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function createSiteSettingsTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
      logo_text VARCHAR(120) NOT NULL DEFAULT 'IKA SMANDA',
      hide_logo_text_on_index TINYINT(1) NOT NULL DEFAULT 0,
      logo_image_url VARCHAR(255) DEFAULT NULL,
      favicon_url VARCHAR(255) DEFAULT NULL,
      hero_title VARCHAR(255) NOT NULL DEFAULT 'Ikatan Keluarga Alumni SMAN 2 Kendal',
      hero_subtitle TEXT DEFAULT NULL,
      hero_primary_text VARCHAR(100) NOT NULL DEFAULT 'Daftar Sekarang',
      hero_primary_link VARCHAR(255) NOT NULL DEFAULT '/pendaftaran',
      hero_secondary_text VARCHAR(100) NOT NULL DEFAULT 'Lihat Direktori',
      hero_secondary_link VARCHAR(255) NOT NULL DEFAULT '/direktori',
      hero_background_url VARCHAR(255) DEFAULT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function ensureSiteSettingsColumns() {
  try {
    await db.execute(`
      ALTER TABLE site_settings
      ADD COLUMN logo_image_url VARCHAR(255) DEFAULT NULL AFTER logo_text
    `);
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') {
      throw err;
    }
  }

  try {
    await db.execute(`
      ALTER TABLE site_settings
      ADD COLUMN hide_logo_text_on_index TINYINT(1) NOT NULL DEFAULT 0 AFTER logo_text
    `);
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') {
      throw err;
    }
  }
}

async function createLapakCategoriesTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS lapak_categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_lapak_categories_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function createProvincesTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS provinces (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_provinces_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function ensureVerificationColumns() {
  const statements = [
    `ALTER TABLE alumni ADD COLUMN is_verified TINYINT(1) NOT NULL DEFAULT 1 AFTER alamat`,
    `ALTER TABLE alumni ADD COLUMN verified_at DATETIME DEFAULT NULL AFTER is_verified`,
    `ALTER TABLE usaha ADD COLUMN is_verified TINYINT(1) NOT NULL DEFAULT 1 AFTER pemilik_id`,
    `ALTER TABLE usaha ADD COLUMN verified_at DATETIME DEFAULT NULL AFTER is_verified`,
  ];

  for (const sql of statements) {
    try {
      await db.execute(sql);
    } catch (err) {
      if (err.code !== 'ER_DUP_FIELDNAME') {
        throw err;
      }
    }
  }
}

async function seedDefaultSiteSettings() {
  await db.execute(
    `INSERT INTO site_settings (
      id,
      logo_text,
      hero_title,
      hero_subtitle,
      hero_primary_text,
      hero_primary_link,
      hero_secondary_text,
      hero_secondary_link
    ) VALUES (1, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE id = id`,
    [
      'IKA SMANDA',
      'Ikatan Keluarga Alumni SMAN 2 Kendal',
      'Menghubungkan alumni lintas angkatan dan membangun kolaborasi nyata bagi almamater serta sesama alumni.',
      'Daftar Sekarang',
      '/pendaftaran',
      'Lihat Direktori',
      '/direktori',
    ],
  );

  await db.execute(`
    UPDATE site_settings
    SET
      hero_primary_link = CASE
        WHEN hero_primary_link = '#daftar' THEN '/pendaftaran'
        ELSE hero_primary_link
      END,
      hero_secondary_link = CASE
        WHEN hero_secondary_link = '#direktori' THEN '/direktori'
        ELSE hero_secondary_link
      END
    WHERE id = 1
  `);
}

async function seedDefaultLapakCategories() {
  const defaultCategories = ['Kuliner', 'Jasa', 'Fashion', 'Teknologi'];
  for (const name of defaultCategories) {
    await db.execute(
      `INSERT INTO lapak_categories (name)
       VALUES (?)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      [name],
    );
  }
}

async function seedDefaultProvinces() {
  const provinces = [
    'Aceh',
    'Sumatera Utara',
    'Sumatera Barat',
    'Riau',
    'Kepulauan Riau',
    'Jambi',
    'Sumatera Selatan',
    'Kepulauan Bangka Belitung',
    'Bengkulu',
    'Lampung',
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Tengah',
    'DI Yogyakarta',
    'Jawa Timur',
    'Banten',
    'Bali',
    'Nusa Tenggara Barat',
    'Nusa Tenggara Timur',
    'Kalimantan Barat',
    'Kalimantan Tengah',
    'Kalimantan Selatan',
    'Kalimantan Timur',
    'Kalimantan Utara',
    'Sulawesi Utara',
    'Gorontalo',
    'Sulawesi Tengah',
    'Sulawesi Barat',
    'Sulawesi Selatan',
    'Sulawesi Tenggara',
    'Maluku',
    'Maluku Utara',
    'Papua',
    'Papua Barat',
    'Papua Barat Daya',
    'Papua Selatan',
    'Papua Tengah',
    'Papua Pegunungan',
  ];

  for (const name of provinces) {
    await db.execute(
      `INSERT INTO provinces (name)
       VALUES (?)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      [name],
    );
  }
}

async function createDefaultAdminIfMissing() {
  const email = String(process.env.ADMIN_DEFAULT_EMAIL || '').trim().toLowerCase();
  const password = String(process.env.ADMIN_DEFAULT_PASSWORD || '').trim();
  const name = String(process.env.ADMIN_DEFAULT_NAME || 'Administrator').trim();

  if (!email || !password) {
    console.warn(
      '[bootstrap] ADMIN_DEFAULT_EMAIL / ADMIN_DEFAULT_PASSWORD tidak di-set. Seed admin dilewati.',
    );
    return;
  }

  const [rows] = await db.execute(
    'SELECT id FROM admin_users WHERE email = ? LIMIT 1',
    [email],
  );

  if (rows.length > 0) {
    return;
  }

  const passwordHash = await hashPassword(password);
  await db.execute(
    'INSERT INTO admin_users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash],
  );

  console.log(`[bootstrap] Admin default dibuat untuk email: ${email}`);
}

async function bootstrapApp() {
  await createAdminTables();
  await createSiteSettingsTable();
  await ensureSiteSettingsColumns();
  await createLapakCategoriesTable();
  await createProvincesTable();
  await ensureVerificationColumns();
  await seedDefaultSiteSettings();
  await seedDefaultLapakCategories();
  await seedDefaultProvinces();
  await createDefaultAdminIfMissing();
  await db.execute('DELETE FROM admin_sessions WHERE expires_at < NOW()');
}

module.exports = { bootstrapApp };
