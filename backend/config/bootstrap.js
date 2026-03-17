const fs = require('fs');
const path = require('path');

const db = require('./db');
const { hashPassword } = require('../utils/auth');

async function applySchema() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = await fs.promises.readFile(schemaPath, 'utf8');
  await db.queryRaw(sql);
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
  await applySchema();
  await createDefaultAdminIfMissing();
  await db.execute('DELETE FROM admin_sessions WHERE expires_at < NOW()');
}

module.exports = { bootstrapApp };
