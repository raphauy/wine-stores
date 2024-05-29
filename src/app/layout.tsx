
import Providers from '@/components/Providers';
import Footer from '@/components/footer';
import { auth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Latidio - Plataforma de ecommerce para pequeños productores.",
  description: "Latidio es la plataforma de ecommerce que conecta a pequeños productores rurales y empresas familiares con las ventas en el mundo digital. Con simplicidad y accesibilidad, transformamos vidas y promovemos un comercio justo y sostenible.",
  openGraph: {
    title: "Latidio",
    description: "Latidio es la plataforma de ecommerce que conecta a pequeños productores rurales y empresas familiares con las ventas en el mundo digital. Con simplicidad y accesibilidad, transformamos vidas y promovemos un comercio justo y sostenible.",
    type: "website",
    url: "https://latidio.com",
  },
  metadataBase: new URL("https://latidio.com"),
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
            <Analytics />
         </div>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}