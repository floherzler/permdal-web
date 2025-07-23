// import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware() {
    return NextResponse.next()
}

export const config = {
    /* match all request paths except for the ones that start with:
    - api
    - _next/static
    - _next/image
    - favicon.ico
    */
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)"
    ]
}