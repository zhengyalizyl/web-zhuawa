import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // console.log(request, event);
  // return NextRequest.next();
  console.log(request.nextUrl.pathname);
  if(request.nextUrl.pathname!=='/login'){
   const token =request.cookies.get('token')?.value;
   if(!token){
    return NextResponse.redirect(new URL('/login',request.url));
   }
  }
}

// /about、 /about/xxx、/about/xxx/xxx
export const config = {
  // matcher: ["/about/:path*",'/dashboard/:path*'],
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ],
}