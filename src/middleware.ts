import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    //manage route protection
    const isAuth = await getToken({ req });
    const isLoginPage = pathname.startsWith("/login");
    const isDashboardPage = pathname.startsWith("/dashboard");

    if (isLoginPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    if (!isAuth && isDashboardPage) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathname === "/") {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
