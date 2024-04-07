import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { UserRole } from '@/entities/user/api/dto/UserRole';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken')?.value;
  const user = request.cookies.get('user')?.value;

  console.log('token', authToken);
  console.log('user', user);

  if (authToken && user) {
    const userData = JSON.parse(user);
    if (request.nextUrl.pathname === '/' && userData.role === UserRole.VENDOR) {
      return NextResponse.redirect(new URL('/requests', request.url));
    }
  } else {
    if (request.nextUrl.pathname !== '/') {
      return NextResponse.redirect(new URL('/login?redirect_url=' + request.nextUrl.pathname, request.url));
    }
  }
  return NextResponse.next();
}

//,
export const config = {
  matcher: ['/', '/requests/:requestId*', '/responses/:responseId*'],
};
