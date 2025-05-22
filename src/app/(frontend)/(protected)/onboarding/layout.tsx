import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { NavigationLink } from '@/types/globals.enum'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
    redirect(NavigationLink.PROFILE)
  }

  return <>{children}</>
}
