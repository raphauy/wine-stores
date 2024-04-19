import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { auth } from "./auth"
import { Metadata } from "next"
import { UserRole } from "@prisma/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getCurrentUser() {
  const session = await auth()

  return session?.user
}

export async function getCurrentStoreId() {
  const session = await auth()

  return session?.user?.storeId
}
export async function getCurrentStoreSlug() {
  const session = await auth()

  return session?.user?.storeSlug
}

export async function getCurrentRole() {
  const session = await auth()

  return session?.user?.role
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase() // Convertir a minúsculas
    .normalize('NFD') // Descomponer los acentos y diacríticos
    .replace(/[\u0300-\u036f]/g, '') // Eliminar los diacríticos
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/[^\w\-]+/g, '') // Eliminar todos los caracteres que no sean palabras o guiones
    .replace(/\-\-+/g, '-') // Reemplazar múltiples guiones con uno solo
    .trim(); // Eliminar espacios al inicio y al final
}

type CurrencyOptions= {
  currency?: 'USD' | 'EUR' | 'GBP' | 'UYU'
  notation?: Intl.NumberFormatOptions['notation']
}
export function formatPrice(price: number | string, options: CurrencyOptions = {}) {
  const { currency = 'UYU', notation = 'compact' } = options

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price

  const res= new Intl.NumberFormat('es-UY', {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 0,
  })
  
  return res.format(numericPrice)
}


export function constructMetadata({
  title = 'Wine Store - el lugar para encontrar tu vino', 
  description = 'Wine Store es un sitio web para encontrar y reservar tu vino. ¡Disfruta de la experiencia!',
  image = '/thumbnail.png',
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@tinta.wine',
    },
    icons,
    metadataBase: new URL('https://agency-planner.com'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}

export function getAdminRoles() {
  return [UserRole.ADMIN, UserRole.STORE_OWNER, UserRole.STORE_ADMIN]
}
