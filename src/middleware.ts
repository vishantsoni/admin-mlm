import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { hasPermission } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  
  // Public routes
  if (request.nextUrl.pathname.startsWith('/signin') || 
      request.nextUrl.pathname.startsWith('/signup') || 
      request.nextUrl.pathname.startsWith('/reset-password') ||
      request.nextUrl.pathname.startsWith('/images') || 
      request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  let payload;
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) throw new Error('Invalid token');
    payload = JSON.parse(atob(tokenParts[1]));
    const now = Date.now();
    // console.log("payload - ", payload, now);
    // console.log("DEBUG role:", payload.role);
    
    if (payload.exp < now) {
      // return NextResponse.redirect(new URL('/signin', request.url));
    }
  } catch(err) {
    console.log("catch error - ",err);
    
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Extract permission from pathname - handle /products/add -> 'products/add'
  console.log("DEBUG raw pathname:", request.nextUrl.pathname);
  const pathname = request.nextUrl.pathname;
  const pathSegments = pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1] || '';
  const actionWords = ['add', 'edit', 'new', 'create', 'update', 'delete', 'category'];
  
  let permission;
  if (pathSegments.length >= 3 && actionWords.includes(lastSegment) && pathSegments[pathSegments.length - 2].match(/^[0-9]+$/)) {
    // Handle /module/[id]/action -> 'module/action'
    permission = pathSegments[pathSegments.length - 3] + '/' + lastSegment;
  } else if (pathSegments.length >= 2 && actionWords.includes(lastSegment)) {
    permission = pathSegments.slice(-2).join('/');
  } else {
    permission = lastSegment || 'dashboard';
  }
  // console.log("DEBUG pathSegments:", pathSegments);
  // console.log("DEBUG permission extracted:", permission);

  if (!hasPermission(payload.role, permission)) {
    // console.log("DEBUG hasPermission false for role:", payload.role, "permission:", permission);
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
'/((?!signin|signup|not-found|api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};

