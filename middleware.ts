import { next } from '@vercel/edge';
import {
  isAuthorized,
  loginResponse,
  tryLoginFromPost,
  SECURITY_HEADERS,
  type ViewerEnv,
} from './lib/viewer-access';

function edgeEnv(): ViewerEnv {
  return {
    VIEWER_PASSWORD: process.env.VIEWER_PASSWORD,
    VIEWER_SESSION_TOKEN: process.env.VIEWER_SESSION_TOKEN,
  };
}

function requestIsSecure(request: Request): boolean {
  const proto = request.headers.get('x-forwarded-proto');
  if (proto) return proto === 'https';
  return new URL(request.url).protocol === 'https:';
}

export default async function middleware(request: Request) {
  const env = edgeEnv();
  const secure = requestIsSecure(request);

  const loginAttempt = await tryLoginFromPost(request, env, secure);
  if (loginAttempt) return loginAttempt;

  if (!isAuthorized(request, env)) {
    return loginResponse(false, secure);
  }

  const res = await next();
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    headers.set(k, v);
  }
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

export const config = {
  matcher: ['/((?!_vercel/insights|_vercel/speed-insights).*)'],
};