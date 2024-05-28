'use client'

import { Button } from './ui/button'
import { ProductDAO } from '@/services/product-services'
import { useCart } from '@/hooks/use-cart'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function CheckoutButton() {

  const { items } = useCart()


  return (
    <Link href={`/carrito`} className={cn("w-full", items.length === 0 && "hidden")}>
      <Button className='w-full mt-4'>
        Ir al Checkout
      </Button>
    </Link>
  )
}


