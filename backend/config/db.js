const { Pool, types } = require('pg');

types.setTypeParser(20, (value) => (value === null ? null : Number(value)));

function buildPoolConfig() {
  const connectionString = String(
    process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || '',
  ).trim();
  const sslEnabled = String(process.env.DB_SSL || 'true').trim().toLowerCase() !== 'false';
  const poolMax = parseInt(process.env.DB_POOL_MAX || '5', 10);

  if (connectionString) {
    return {
      connectionString,
      ssl: sslEnabled ? { rejectUnauthorized: false } : false,
      max: Number.isInteger(poolMax) && poolMax > 0 ? poolMax : 5,
    };
  }

  return {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    max: Number.isInteger(poolMax) && poolMax > 0 ? poolMax : 5,
  };
}

const pool = new Pool(buildPoolConfig());

function normalizeError(err) {
  if (!err || !err.code) return err;

  if (err.code === '23505') {
    err.code = 'ER_DUP_ENTRY';
  } else if (err.code === '23503') {
    err.code = 'ER_NO_REFERENCED_ROW_2';
  } else if (err.code === '42701') {
    err.code = 'ER_DUP_FIELDNAME';
  }

  return err;
}

function normalizeResult(result, sql) {
  const trimmedSql = String(sql || '').trim().toUpperCase();

  if (trimmedSql.startsWith('SELECT')) {
    return [result.rows];
  }

  return [{
    rows: result.rows,
    rowCount: result.rowCount,
    affectedRows: result.rowCount,
    insertId: result.rows?.[0]?.id ?? null,
  }];
}

function convertSql(sql, params = []) {
  let placeholderIndex = 0;
  let converted = String(sql || '');

  converted = converted.replace(
    /([A-Za-z0-9_."]+)\s*<=>\s*\?|(\?)/g,
    (match, nullSafeColumn, standardPlaceholder) => {
      placeholderIndex += 1;

      if (nullSafeColumn) {
        return `${nullSafeColumn} IS NOT DISTINCT FROM $${placeholderIndex}`;
      }

      if (standardPlaceholder) {
        return `$${placeholderIndex}`;
      }

      return match;
    },
  );

  if (/^\s*INSERT\b/i.test(converted) && !/\bRETURNING\b/i.test(converted)) {
    converted = `${converted.trim()} RETURNING id`;
  }

  return {
    text: converted,
    values: params,
  };
}

async function executeQuery(client, sql, params = []) {
  try {
    const query = convertSql(sql, params);
    const result = await client.query(query);
    return normalizeResult(result, sql);
  } catch (err) {
    throw normalizeError(err);
  }
}

function createConnectionWrapper(client) {
  return {
    execute(sql, params = []) {
      return executeQuery(client, sql, params);
    },
    async queryRaw(sql) {
      try {
        return await client.query(sql);
      } catch (err) {
        throw normalizeError(err);
      }
    },
    beginTransaction() {
      return client.query('BEGIN');
    },
    commit() {
      return client.query('COMMIT');
    },
    rollback() {
      return client.query('ROLLBACK');
    },
    release() {
      client.release();
    },
  };
}

module.exports = {
  execute(sql, params = []) {
    return executeQuery(pool, sql, params);
  },
  async queryRaw(sql) {
    try {
      return await pool.query(sql);
    } catch (err) {
      throw normalizeError(err);
    }
  },
  async getConnection() {
    const client = await pool.connect();
    return createConnectionWrapper(client);
  },
  async end() {
    await pool.end();
  },
};
