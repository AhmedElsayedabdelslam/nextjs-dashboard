import { NextResponse } from 'next/server';

const protectedPaths = ['/Dashboard', '/profile', '/medicines', '/diagnosis', '/hospitals'];

export function middleware(req) {
    const { pathname } = req.nextUrl;

    if (protectedPaths.some(path => pathname.startsWith(path))) {
        const token = req.cookies.get('token')?.value;

        if (!token || token !== 'jkhfkalkjladjflljppjahgagjcpokopjpidocjpjicidjiochdicngaiycugoafllcc') {
            const loginUrl = new URL('/login', req.url);
            loginUrl.searchParams.set('from', pathname); // إضافة من أي صفحة جاي
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/Dashboard', '/profile', '/medicines', '/diagnosis', '/hospitals'],
};