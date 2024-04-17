'use client'

import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { PropsWithChildren, useState } from 'react'
import { TailwindIndicator } from './shadcn/tailwind-indicator'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'

type Props= {
  children: React.ReactNode
  session: Session | null
}
export default function Providers({ children, session }: PropsWithChildren<Props>) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider delayDuration={0}>
          {children}
        </TooltipProvider>
        <TailwindIndicator />
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  )
}


