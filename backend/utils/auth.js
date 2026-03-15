const crypto = require('crypto');
const { promisify } = require('util');

const scryptAsync = promisify(crypto.scrypt);
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_SALT_BYTES = 16;
const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

async function hashPassword(password) {
  const salt = crypto.randomBytes(PASSWORD_SALT_BYTES).toString('hex');
  const derived = await scryptAsync(password, salt, PASSWORD_KEY_LENGTH);
  return `${salt}:${Buffer.from(derived).toString('hex')}`;
}

async function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== 'string' || !storedHash.includes(':')) {
    return false;
  }

  const [salt, keyHex] = storedHash.split(':');
  if (!salt || !keyHex) return false;

  const expected = Buffer.from(keyHex, 'hex');
  const derived = await scryptAsync(password, salt, PASSWORD_KEY_LENGTH);
  const actual = Buffer.from(derived);

  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

function generateSessionToken() {
  return crypto.randomBytes(48).toString('hex');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function getSessionTtlSeconds() {
  const parsed = parseInt(process.env.ADMIN_SESSION_TTL_SECONDS, 10);
  if (Number.isNaN(parsed) || parsed < 300) {
    return DEFAULT_SESSION_TTL_SECONDS;
  }
  return parsed;
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateSessionToken,
  hashToken,
  getSessionTtlSeconds,
};
