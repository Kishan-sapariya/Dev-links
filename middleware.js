import { verifyToken } from './lib/auth';

export async function middleware(request) {
  return await verifyToken(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
