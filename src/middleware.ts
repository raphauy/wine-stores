import NextAuth from "next-auth"
import authConfig from "@/lib/auth.config"
import { NextResponse } from "next/server"
  
const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
    if (isApiAuthRoute) {
        return
    }

    if (nextUrl.pathname.startsWith("/auth")) { 
        const isLoggedIn = !!req.auth
        if (isLoggedIn) {
            return Response.redirect(new URL("/", nextUrl))
        }
        return
    }

    const host= req.headers.get('host') || req.headers.get('x-forwarded-host')
    if (!host) return

    console.log('host: ', host)
    
    const hostRewrite= getHostRewrite(host)

    if (hostRewrite) {
        console.log('hostRewrite', hostRewrite)
        const searchParams = nextUrl.searchParams.toString()
        const path = nextUrl.pathname
        const newUrl= `/${hostRewrite}${path}${searchParams.length > 0 ? `?${searchParams}` : ''}`
        console.log('newUrl', newUrl)
        
        return NextResponse.rewrite(new URL(newUrl, req.url))
    } else {
        console.log('no hostRewrite')        
    }

    return
})

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}

function getHostRewrite(host: string) {
    switch (host) {
        case 'gimenez-mendez.localhost:3000': 
            return 'gimenez-mendez'
        case 'gimenez-mendez.wine-stores.tinta.wine': 
            return 'gimenez-mendez'
        case 'gimenez-mendez.tinta.wine': 
            return 'gimenez-mendez'
        case 'gimenez-mendez.tunnel.tinta.wine':
            return 'gimenez-mendez'

        case 'cerro-chapeu.tunnel.tinta.wine':
            return 'cerro-chapeu'
    
        case 'bodega-familiar.tinta.wine': 
            return 'bodega-familiar'

        case 'libro.uruguayenvinos.com':
            return 'uruguayenvinos'
            
        default:
            return ""
    }
    
}