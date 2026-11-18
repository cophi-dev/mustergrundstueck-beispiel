const COOKIE_NAME = 'viewer_access';
const COOKIE_MAX_AGE_SEC = 180 * 24 * 60 * 60;

const SECURITY_HEADERS = {
  'Cache-Control': 'no-store',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
};

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function getSessionCookie(request) {
  const raw = request.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const p = part.trim();
    if (p.startsWith(`${COOKIE_NAME}=`)) {
      return decodeURIComponent(p.slice(COOKIE_NAME.length + 1));
    }
  }
  return null;
}

function edgeEnv() {
  return {
    VIEWER_PASSWORD: process.env.VIEWER_PASSWORD,
    VIEWER_SESSION_TOKEN: process.env.VIEWER_SESSION_TOKEN,
  };
}

function isAuthorized(request, env) {
  const token = env.VIEWER_SESSION_TOKEN;
  if (!token) return false;
  const cookie = getSessionCookie(request);
  return cookie !== null && timingSafeEqual(cookie, token);
}

function buildSetCookieHeader(token, secure) {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    `Max-Age=${COOKIE_MAX_AGE_SEC}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

function loginHtml() {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>Persönlicher Projektbereich</title>
  <style>
    :root { --ink: #1f2a33; --muted: #5d6a74; --line: #dfe4e8; --accent: #2f5d50; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
      padding: 24px; background: #eef1f3; color: var(--ink);
      font: 15px/1.45 system-ui, -apple-system, 'Segoe UI', sans-serif; }
    main { width: 100%; max-width: 400px; background: #fff; border: 1px solid var(--line);
      border-radius: 12px; padding: 28px 24px 24px; box-shadow: 0 8px 28px rgba(20,30,40,.08); }
    h1 { margin: 0 0 20px; font-size: 1.25rem; font-weight: 700; }
    label { display: block; font-size: 13px; font-weight: 600; color: var(--muted); margin-bottom: 6px; }
    input[type=password] { width: 100%; padding: 10px 12px; border: 1px solid var(--line);
      border-radius: 8px; font: inherit; }
    input[type=password]:focus { outline: 2px solid var(--accent); outline-offset: 1px; border-color: var(--accent); }
    button { margin-top: 16px; width: 100%; padding: 11px 14px; border: 0; border-radius: 8px;
      background: var(--accent); color: #fff; font: 600 15px inherit; cursor: pointer; }
    button:hover { filter: brightness(1.05); }
    .hint { margin: 20px 0 0; font-size: 13px; color: var(--muted); line-height: 1.5; }
    .err { margin: 0 0 12px; font-size: 13px; color: #b23b2e; display: none; }
    .err.show { display: block; }
  </style>
</head>
<body>
  <main>
    <h1>Persönlicher Projektbereich</h1>
    <p class="err" id="err">Zugang nicht möglich. Bitte Passwort prüfen.</p>
    <form method="post" action="">
      <label for="password">Passwort</label>
      <input id="password" name="password" type="password" autocomplete="current-password" required>
      <button type="submit">Anmelden</button>
    </form>
    <p class="hint">Das Passwort steht in der E-Mail von Phillipp Zarindast. Dieses Gerät bleibt danach angemeldet. Auf Wunsch vergeben wir ein neues Passwort.</p>
  </main>
  <script>
    if (location.search.indexOf('f=1') !== -1) document.getElementById('err').classList.add('show');
  </script>
</body>
</html>`;
}

function loginResponse(showFailure) {
  const headers = new Headers({
    'Content-Type': 'text/html; charset=utf-8',
    ...SECURITY_HEADERS,
  });
  let body = loginHtml();
  if (showFailure) body = body.replace('class="err"', 'class="err show"');
  return new Response(body, { status: 401, headers });
}

async function tryLoginFromPost(request, env, secure) {
  if (request.method !== 'POST') return null;
  const expected = env.VIEWER_PASSWORD;
  const token = env.VIEWER_SESSION_TOKEN;
  if (!expected || !token) return loginResponse(true);

  let submitted = '';
  const ct = request.headers.get('content-type') || '';
  if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
    const form = await request.formData();
    submitted = String(form.get('password') ?? '');
  }

  if (!timingSafeEqual(submitted, expected)) return loginResponse(true);

  const url = new URL(request.url);
  const headers = new Headers({
    Location: url.pathname + url.search,
    'Set-Cookie': buildSetCookieHeader(token, secure),
    ...SECURITY_HEADERS,
  });
  return new Response(null, { status: 303, headers });
}

function requestIsSecure(request) {
  const proto = request.headers.get('x-forwarded-proto');
  if (proto) return proto === 'https';
  return new URL(request.url).protocol === 'https:';
}

export default async function middleware(request) {
  const env = edgeEnv();
  const secure = requestIsSecure(request);

  const loginAttempt = await tryLoginFromPost(request, env, secure);
  if (loginAttempt) return loginAttempt;

  if (!isAuthorized(request, env)) return loginResponse(false);

  const res = await fetch(request);
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

export const config = {
  matcher: ['/((?!_vercel/insights|_vercel/speed-insights).*)'],
};