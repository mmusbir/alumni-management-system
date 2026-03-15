CREATE DATABASE IF NOT EXISTS ika_smanda
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ika_smanda;

-- Alumni table
CREATE TABLE IF NOT EXISTS alumni (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nama          VARCHAR(150)   NOT NULL,
  angkatan      VARCHAR(10)    NOT NULL,
  tempat_lahir  VARCHAR(100)   DEFAULT NULL,
  tanggal_lahir DATE           DEFAULT NULL,
  gender        ENUM('Laki-laki','Perempuan') NOT NULL DEFAULT 'Laki-laki',
  email         VARCHAR(150)   NOT NULL,
  phone         VARCHAR(20)    NOT NULL,
  profesi       VARCHAR(100)   DEFAULT NULL,
  punya_usaha   TINYINT(1)     NOT NULL DEFAULT 0,
  nama_usaha    VARCHAR(150)   DEFAULT NULL,
  kategori_usaha VARCHAR(100)  DEFAULT NULL,
  provinsi      VARCHAR(100)   DEFAULT NULL,
  kota          VARCHAR(100)   DEFAULT NULL,
  alamat        TEXT           DEFAULT NULL,
  is_verified   TINYINT(1)     NOT NULL DEFAULT 1,
  verified_at   DATETIME       DEFAULT NULL,
  created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_email (email),
  UNIQUE KEY uq_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Usaha (business) table
CREATE TABLE IF NOT EXISTS usaha (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nama_usaha    VARCHAR(150)   NOT NULL,
  kategori      VARCHAR(100)   NOT NULL,
  pemilik_id    INT            NOT NULL,
  is_verified   TINYINT(1)     NOT NULL DEFAULT 1,
  verified_at   DATETIME       DEFAULT NULL,
  created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  KEY idx_kategori (kategori),
  CONSTRAINT fk_usaha_alumni FOREIGN KEY (pemilik_id) REFERENCES alumni(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lapak_categories (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)   NOT NULL,
  created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_lapak_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS provinces (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)   NOT NULL,
  created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_provinces_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120)   NOT NULL,
  email         VARCHAR(150)   NOT NULL,
  password_hash VARCHAR(255)   NOT NULL,
  created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_admin_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  admin_id      INT            NOT NULL,
  token_hash    CHAR(64)       NOT NULL,
  user_agent    VARCHAR(255)   DEFAULT NULL,
  ip_address    VARCHAR(45)    DEFAULT NULL,
  expires_at    DATETIME       NOT NULL,
  created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_admin_token_hash (token_hash),
  KEY idx_admin_session_admin_id (admin_id),
  KEY idx_admin_session_expires (expires_at),
  CONSTRAINT fk_admin_sessions_admin_users FOREIGN KEY (admin_id) REFERENCES admin_users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Front page settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id                  TINYINT UNSIGNED PRIMARY KEY,
  logo_text           VARCHAR(120)   NOT NULL DEFAULT 'IKA SMANDA',
  hide_logo_text_on_index TINYINT(1) NOT NULL DEFAULT 0,
  logo_image_url      VARCHAR(255)   DEFAULT NULL,
  favicon_url         VARCHAR(255)   DEFAULT NULL,
  hero_title          VARCHAR(255)   NOT NULL DEFAULT 'Ikatan Keluarga Alumni SMAN 2 Kendal',
  hero_subtitle       TEXT           DEFAULT NULL,
  hero_primary_text   VARCHAR(100)   NOT NULL DEFAULT 'Daftar Sekarang',
  hero_primary_link   VARCHAR(255)   NOT NULL DEFAULT '/pendaftaran',
  hero_secondary_text VARCHAR(100)   NOT NULL DEFAULT 'Lihat Direktori',
  hero_secondary_link VARCHAR(255)   NOT NULL DEFAULT '/direktori',
  hero_background_url VARCHAR(255)   DEFAULT NULL,
  updated_at          TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO site_settings (
  id, logo_text, hero_title, hero_subtitle, hero_primary_text, hero_primary_link, hero_secondary_text, hero_secondary_link
) VALUES (
  1,
  'IKA SMANDA',
  'Ikatan Keluarga Alumni SMAN 2 Kendal',
  'Menghubungkan alumni lintas angkatan dan membangun kolaborasi nyata bagi almamater serta sesama alumni.',
  'Daftar Sekarang',
  '/pendaftaran',
  'Lihat Direktori',
  '/direktori'
)
ON DUPLICATE KEY UPDATE id = id;

INSERT INTO lapak_categories (name)
VALUES
  ('Kuliner'),
  ('Jasa'),
  ('Fashion'),
  ('Teknologi')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO provinces (name)
VALUES
  ('Aceh'),
  ('Sumatera Utara'),
  ('Sumatera Barat'),
  ('Riau'),
  ('Kepulauan Riau'),
  ('Jambi'),
  ('Sumatera Selatan'),
  ('Kepulauan Bangka Belitung'),
  ('Bengkulu'),
  ('Lampung'),
  ('DKI Jakarta'),
  ('Jawa Barat'),
  ('Jawa Tengah'),
  ('DI Yogyakarta'),
  ('Jawa Timur'),
  ('Banten'),
  ('Bali'),
  ('Nusa Tenggara Barat'),
  ('Nusa Tenggara Timur'),
  ('Kalimantan Barat'),
  ('Kalimantan Tengah'),
  ('Kalimantan Selatan'),
  ('Kalimantan Timur'),
  ('Kalimantan Utara'),
  ('Sulawesi Utara'),
  ('Gorontalo'),
  ('Sulawesi Tengah'),
  ('Sulawesi Barat'),
  ('Sulawesi Selatan'),
  ('Sulawesi Tenggara'),
  ('Maluku'),
  ('Maluku Utara'),
  ('Papua'),
  ('Papua Barat'),
  ('Papua Barat Daya'),
  ('Papua Selatan'),
  ('Papua Tengah'),
  ('Papua Pegunungan')
ON DUPLICATE KEY UPDATE name = VALUES(name);
