import { NextResponse } from "next/server";
import { verifyAccessToken } from "./lib/tokens";

export function middleware(request){
  const {pathname, search} = request.nextUrl;

  const isMealDetail = pathname.startsWith('/meals/') && pathname !== '/meals/share' && pathname !== '/meals'

  const isProtectedRoute = isMealDetail || pathname.startsWith('/meals/share') || pathname.startsWith('/community')

  if(! isProtectedRoute){
    return NextResponse.next()
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if(accessToken){
    const decoded = verifyAccessToken(accessToken);
    if(decoded){
      return NextResponse.next();
    }
  }

  if(! accessToken && ! refreshToken){
    const loginUrl = new URL('/authusers/LogIn', request.url)

    loginUrl.searchParams.set(
      "callbackUrl", pathname + search
    );

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher:[
    "/community/:path*",
    "/meals/:path*"
  ]
}