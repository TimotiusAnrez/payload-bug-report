import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NavigationLink } from './types/globals.enum'
import { NextRequest, NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([NavigationLink.PROFILE, NavigationLink.ONBOARDING])
const isAdminProtectedRoute = createRouteMatcher([NavigationLink.ADMIN])

const needOnboardingRoute = createRouteMatcher([NavigationLink.PROFILE, NavigationLink.ADMIN])

const isPublicRoute = createRouteMatcher([
  NavigationLink.SIGN_IN,
  NavigationLink.SIGN_UP,
  '/api/webhooks(.*)',
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth()

  if (isAdminProtectedRoute(req)) {
    if (!userId) return redirectToSignIn()

    const adminRole = ['ADMIN_USER', 'ADMIN_AGRI', 'ADMIN', 'SUPER_ADMIN']

    // //if user and not have admin role redirect to profile
    // if (userId && !adminRole.includes(sessionClaims.private.role))
    //   return NextResponse.redirect(new URL(NavigationLink.PROFILE, req.url)) //maybe to 403 forbiden page later on

    // //if user and have admin role redirect to admin
    // if (userId && adminRole.includes(sessionClaims.private.role)) return NextResponse.next()

    return NextResponse.next()
  }

  //for non users and route is private redirect to sign in
  if (!userId && (isProtectedRoute(req) || isAdminProtectedRoute(req))) return redirectToSignIn()

  //for users visting need onboarding route and have not complete the process
  if (userId && !sessionClaims.metadata.onboardingComplete && needOnboardingRoute(req)) {
    const onboardingURL = new URL(NavigationLink.ONBOARDING, req.url)
    return NextResponse.redirect(onboardingURL)
  }

  //for users that are visiting protected route
  if (userId && isProtectedRoute(req)) return NextResponse.next()

  //for non users and route is public return next
  if (!userId && isPublicRoute(req)) return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
