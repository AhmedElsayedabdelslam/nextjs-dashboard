// import { NextResponse } from 'next/server';

// const protectedPaths = ['/Dashboard', '/profile', '/medicines', '/diagnosis', '/hospitals'];

// export function middleware(req) {
//     const { pathname } = req.nextUrl;

//     if (protectedPaths.some(path => pathname.startsWith(path))) {
//         console.log(`User is trying to access protected page: ${pathname}`);

//         const token = req.cookies.get('token');

//         if (!token || token !== 'jkhfkalkjladjflljppjahgagjcpokopjpidocjpjicidjiochdicngaiycugoafllcc') {
//             const loginUrl = new URL('/login', req.url);
//             console.log('Token missing or invalid, redirecting to login.');
//             return NextResponse.redirect(loginUrl);
//         }

//         console.log('Token valid, allowing access.');
//         return NextResponse.next();
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ['/Dashboard', '/profile', '/medicines', '/diagnosis', '/hospitals'],
// };
