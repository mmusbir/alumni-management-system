const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = String(process.env.SUPABASE_URL || '').trim();
const SUPABASE_SERVICE_ROLE_KEY = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
const SUPABASE_STORAGE_BUCKET = String(
  process.env.SUPABASE_STORAGE_BUCKET || 'ikasmanda-assets',
).trim();

let supabaseClient = null;

function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diisi.');
  }

  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return supabaseClient;
}

function sanitizeFileName(name = 'file') {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'file';
}

function buildStoragePath(folder, originalName) {
  const extMatch = String(originalName || '').toLowerCase().match(/(\.[a-z0-9]+)$/);
  const ext = extMatch ? extMatch[1] : '';
  const baseName = sanitizeFileName(String(originalName || 'file').replace(/\.[^.]+$/, ''));
  return `${folder}/${Date.now()}-${baseName}${ext}`;
}

async function uploadPublicAsset(file, folder) {
  if (!file?.buffer) {
    return null;
  }

  const supabase = getSupabaseClient();
  const storagePath = buildStoragePath(folder, file.originalname);
  const { error } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(storagePath, file.buffer, {
      contentType: file.mimetype || 'application/octet-stream',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload Supabase gagal: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(storagePath);

  return {
    storagePath,
    publicUrl,
  };
}

function extractStoragePath(publicUrl) {
  if (!publicUrl) return null;

  try {
    const parsed = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/`;
    const markerIndex = parsed.pathname.indexOf(marker);
    if (markerIndex === -1) return null;
    return decodeURIComponent(parsed.pathname.slice(markerIndex + marker.length));
  } catch (_err) {
    return null;
  }
}

async function removePublicAsset(publicUrl) {
  const storagePath = extractStoragePath(publicUrl);
  if (!storagePath) return;

  const supabase = getSupabaseClient();
  const { error } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .remove([storagePath]);

  if (error) {
    throw new Error(`Hapus asset Supabase gagal: ${error.message}`);
  }
}

module.exports = {
  SUPABASE_STORAGE_BUCKET,
  getSupabaseClient,
  uploadPublicAsset,
  removePublicAsset,
};
