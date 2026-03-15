const COOKIE_NAME = 'ika_admin_session';

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, pair) => {
      const sepIdx = pair.indexOf('=');
      if (sepIdx < 0) return acc;
      const key = pair.slice(0, sepIdx).trim();
      const value = pair.slice(sepIdx + 1).trim();
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
}

function buildCookie(value, maxAgeSeconds) {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ];

  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure');
  }

  return parts.join('; ');
}

function setSessionCookie(res, token, maxAgeSeconds) {
  res.setHeader('Set-Cookie', buildCookie(token, maxAgeSeconds));
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', buildCookie('', 0));
}

function readSessionTokenFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  return cookies[COOKIE_NAME] || null;
}

module.exports = {
  COOKIE_NAME,
  parseCookies,
  setSessionCookie,
  clearSessionCookie,
  readSessionTokenFromRequest,
};
