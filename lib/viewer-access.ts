/** Shared Zugangslogik für Vercel-Middleware und lokale Tests. */

export const COOKIE_NAME = 'viewer_access';
export const COOKIE_MAX_AGE_SEC = 180 * 24 * 60 * 60; // 180 Tage

export const SECURITY_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
};

export type ViewerEnv = {
  VIEWER_PASSWORD?: string;
  VIEWER_SESSION_TOKEN?: string;
};

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export function getSessionCookie(request: Request): string | null {
  const raw = request.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const p = part.trim();
    if (p.startsWith(`${COOKIE_NAME}=`)) {
      return decodeURIComponent(p.slice(COOKIE_NAME.length + 1));
    }
  }
  return null;
}

export function isAuthorized(request: Request, env: ViewerEnv): boolean {
  const token = env.VIEWER_SESSION_TOKEN;
  if (!token) return false;
  const cookie = getSessionCookie(request);
  return cookie !== null && timingSafeEqual(cookie, token);
}

export function buildSetCookieHeader(token: string, secure: boolean): string {
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

export function loginHtml(): string {
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

export function loginResponse(showFailure: boolean, secure: boolean): Response {
  const headers = new Headers({
    'Content-Type': 'text/html; charset=utf-8',
    ...SECURITY_HEADERS,
  });
  const body = loginHtml();
  if (showFailure) {
    return new Response(body.replace('class="err"', 'class="err show"'), { status: 401, headers });
  }
  return new Response(body, { status: 401, headers });
}

export async function tryLoginFromPost(
  request: Request,
  env: ViewerEnv,
  secure: boolean,
): Promise<Response | null> {
  if (request.method !== 'POST') return null;
  const expected = env.VIEWER_PASSWORD;
  const token = env.VIEWER_SESSION_TOKEN;
  if (!expected || !token) return loginResponse(true, secure);

  let submitted = '';
  const ct = request.headers.get('content-type') || '';
  if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
    const form = await request.formData();
    submitted = String(form.get('password') ?? '');
  }

  if (!timingSafeEqual(submitted, expected)) {
    return loginResponse(true, secure);
  }

  const url = new URL(request.url);
  const headers = new Headers({
    Location: url.pathname + url.search,
    'Set-Cookie': buildSetCookieHeader(token, secure),
    ...SECURITY_HEADERS,
  });
  return new Response(null, { status: 303, headers });
}