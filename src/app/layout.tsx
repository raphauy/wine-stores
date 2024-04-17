
import Logged from '@/components/header/logged';
import Logo from '@/components/header/logo';
import Menu from '@/components/header/menu';
import Selectors from '@/components/header/selectors/selectors';
import { TailwindIndicator } from '@/components/shadcn/tailwind-indicator';
import { ThemeProvider } from '@/components/shadcn/theme-provider';
import { LinealToggle } from '@/components/shadcn/toggle-theme';
import { auth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/components/Providers';
import Footer from '@/components/footer';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Wine Store",
  description: "A nice and simple Store for small businesses",
  openGraph: {
    title: "Wine Store",
    description: "A nice and simple Store for small businesses",
    type: "website",
    url: "https://wine-stores.com",
    images: [
      {
        url: "https://wine-stores.com/wine-stores-logo.png",
        width: 282,
        height: 45,
        alt: "Wine Stores Logo",
      },
    ],
  },
};

interface Props {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
  
  const session = await auth();

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen flex flex-col text-muted-foreground")}>
        <Providers session={session}>            
          <div className="flex flex-col items-center flex-1 w-full bg-slate-50 dark:bg-black">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}