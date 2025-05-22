import React from 'react'
import '@/styles/globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  description: 'Manggarai Barat Public Service Web Application',
  title: 'Visit Manggarai',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <ClerkProvider>
      <html lang="en">
        <body className="w-screen min-h-screen">
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
