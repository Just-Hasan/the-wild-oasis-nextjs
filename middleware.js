////////[Experiment with middleware]
/*
import { NextResponse } from "next/server";

export function middleware(request) {
    console.log(request);
    
    return NextResponse.redirect(new URL("/about", request.url));
}
*/

import { auth } from "./app/_lib/auth";
export const middleware = auth;

// matcher, basically telling NextJS on which route the middleware must be executed
export const config = {
  matcher: ["/account"],
};
