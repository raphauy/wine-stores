import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { auth } from "./auth"
import { Metadata } from "next"
import { OrderStatus, PaymentMethod, UserRole } from "@prisma/client"
import { format, isThisWeek, isToday, isYesterday, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { StoreDAO } from "@/services/store-services"

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
  const { currency = 'UYU', notation = 'standard' } = options

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
  title = 'Tienda', 
  description = 'ecommerce que conecta a pequeños productores rurales y empresas familiares con las ventas en el mundo digital. Con simplicidad y accesibilidad, transformamos vidas y promovemos un comercio justo y sostenible.',
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
  }
}

export function getAdminRoles() {
  return [UserRole.ADMIN, UserRole.STORE_OWNER, UserRole.STORE_ADMIN]
}

export function formatWhatsAppStyle(date: Date | string): string {
  let parsedDate = typeof date === 'string' ? parseISO(date) : date;

  // todo timezone
  
  if (isToday(parsedDate)) {
    // return "hoy"
    return format(parsedDate, 'HH:mm')
  } else if (isYesterday(parsedDate)) {
    return 'Ayer'
  } else if (isThisWeek(parsedDate)) {
    return format(parsedDate, 'eeee', { locale: es })
  } else {
    return format(parsedDate, 'dd/MM/yyyy')
  }
}

/**
 * Función que recibe un string HTML y devuelve solo el texto.
 * @param htmlString - El string HTML de entrada.
 * @returns El texto extraído del HTML.
 */
export function htmlToText(htmlString: string): string {
  // Eliminar las etiquetas <h2>
  htmlString = htmlString.replace(/<h2[^>]*>/g, '').replace(/<\/h2>/g, '');

  // Eliminar las etiquetas <p>
  htmlString = htmlString.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '');

  // Eliminar las etiquetas <strong>
  htmlString = htmlString.replace(/<strong[^>]*>/g, '').replace(/<\/strong>/g, '');

  // Eliminar las etiquetas <em>
  htmlString = htmlString.replace(/<em[^>]*>/g, '').replace(/<\/em>/g, '');

  // Eliminar las etiquetas <u>
  htmlString = htmlString.replace(/<u[^>]*>/g, '').replace(/<\/u>/g, '');

  // Eliminar las etiquetas <li>
  htmlString = htmlString.replace(/<li[^>]*>/g, '').replace(/<\/li>/g, '');

  // Eliminar las etiquetas <ul> y <ol>
  htmlString = htmlString.replace(/<ul[^>]*>/g, '').replace(/<\/ul>/g, '');
  htmlString = htmlString.replace(/<ol[^>]*>/g, '').replace(/<\/ol>/g, '');

  // Eliminar cualquier otra etiqueta HTML
  htmlString = htmlString.replace(/<[^>]*>/g, '');

  return htmlString;
}

export function completeWithZeros(number: number): string {
  return number.toString().padStart(7, "0")
}

export function getLabel(status: OrderStatus, paymentMethod: PaymentMethod) {
  switch (status) {
    case OrderStatus.Created:
      return "Creada"
    case OrderStatus.Pending:
      if (paymentMethod === PaymentMethod.TransferenciaBancaria)
        return "Transferencia Pendiente"
      else if (paymentMethod === PaymentMethod.MercadoPago)
        return "Confirmación MP pendiente"
      else
        return "Pago Pendiente"
    case OrderStatus.PaymentSent:
      return "Transferencia enviada"
    case OrderStatus.Paid:
      return "Pagada"
    case OrderStatus.Delivered:
      return "Entregada"
    case OrderStatus.Packing:
      return "Preparando"
    case OrderStatus.Rejected:
      return "Rechazada"
    case OrderStatus.Refunded:
      return "Reembolsada"
    case OrderStatus.Cancelled:
      return "Cancelada"
    default:
      return "Sin estado"
  }
  
}

export function extractEmail(replyTo: string) {
  const match= replyTo.match(/<(.*)>/)
  if (match) {
    return match[1]
  }
  return null
  
}