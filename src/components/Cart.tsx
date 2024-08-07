'use client'

import { ShoppingCart } from 'lucide-react'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { Separator } from './ui/separator'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { Button, buttonVariants } from './ui/button'
import Image from 'next/image'
import { ScrollArea } from './ui/scroll-area'
import { useEffect, useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import CartItem from './CartItem'
import { ProductDAO } from '@/services/product-services'

export type ProductQuantity = {
  product: ProductDAO
  quantity: number
}

const Cart = () => {

  const { items } = useCart()
  const itemCount = items.length

  const [fee, setFee] = useState<number>(0)
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const cartTotal = items.reduce((total, { product }) => total + (product.discountPrice ? product.discountPrice : product.price),0)

  const uniqueProducts: ProductQuantity[] = []

  items.forEach(({ product }) => {
    const shippingCost= product.shippingCost ? product.shippingCost : 0
    if (shippingCost > fee) {
      setFee(shippingCost)
    }
    if (!uniqueProducts.find(({ product: p }) => p.id === product.id)) {
      uniqueProducts.push({ product, quantity: 1 })
    } else {
      const index = uniqueProducts.findIndex(({ product: p }) => p.id === product.id)
      uniqueProducts[index].quantity += 1
    }
  })

  return (
    <Sheet>
      <SheetTrigger className='group -m-2 flex items-center p-2'>
        <ShoppingCart
          aria-hidden='true'
          className='h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
        />
        <span className='ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800'>
          {isMounted ? itemCount : 0}
        </span>
      </SheetTrigger>
      <SheetContent className='flex w-full flex-col pr-0 sm:max-w-lg'>
        <SheetHeader className='space-y-2.5 pr-6'>
          <SheetTitle>Carrito ({itemCount})</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <div className='flex w-full flex-col pr-6'>
              <ScrollArea>
                {uniqueProducts.map((productQuantity, index) => (
                  <CartItem key={productQuantity.product.id} product={productQuantity} />
                ))}
              </ScrollArea>
            </div>
            <div className='space-y-4 pr-6'>
              <Separator />
              <div className='space-y-1.5 text-sm'>
                <div className='flex'>
                  <span className='flex-1'>Envío</span>
                  { fee > 0 ? formatPrice(fee) 
                    :
                    <p>Gratis</p>
                  }
                </div>
                <div className='flex'>
                  <span className='flex-1'>Total</span>
                  <span>
                    {formatPrice(cartTotal + fee)}
                  </span>
                </div>
              </div>

              <SheetFooter>
                <SheetTrigger asChild>
                  <Link href={`/carrito`} className='w-full'>
                    <Button className='w-full'>
                      Ir al Checkout
                    </Button>
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className='flex h-full flex-col items-center justify-center space-y-1'>
            <div
              aria-hidden='true'
              className='relative mb-4 h-60 w-60 text-muted-foreground'>
              <Image
                src='/hippo-empty-cart.png'
                fill
                alt='empty shopping cart hippo'
              />
            </div>
            <div className='text-xl font-semibold'>
              Tu carrito está vacío
            </div>
            <SheetTrigger asChild>
              <Link href='/products' className={buttonVariants({ variant: 'link', size: 'sm', className:'text-sm text-muted-foreground' })}>
                Agrega items a tu carrito para hacer checkout
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default Cart
