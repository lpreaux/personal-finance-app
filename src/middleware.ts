import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  // Block /sandbox route in production
  if (req.nextUrl.pathname.startsWith("/sandbox")) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
