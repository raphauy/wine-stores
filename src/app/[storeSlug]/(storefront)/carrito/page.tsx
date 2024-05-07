'use client'

import { ProductQuantity } from '@/components/Cart'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { useCart } from '@/hooks/use-cart'
import { cn, formatPrice } from '@/lib/utils'
import { Check, Loader2, MinusCircle, PlusCircle, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import OrderSummary from '../checkout/order-summary'

export const FEE = 250

export default function Page() { 
  const { items, addItem, removeItem, removeAllOf } = useCart()

  const [loading, setLoading] = useState(false)

  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const uniqueProducts: ProductQuantity[] = []

  items.forEach(({ product }) => {
    if (!uniqueProducts.find(({ product: p }) => p.id === product.id)) {
      uniqueProducts.push({ product, quantity: 1 })
    } else {
      const index = uniqueProducts.findIndex(({ product: p }) => p.id === product.id)
      uniqueProducts[index].quantity += 1
    }
  })

  // sort by product name
  uniqueProducts.sort((a, b) => a.product.name.localeCompare(b.product.name))

  return (
    <div className=''>
      <div className='mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
          Carrito
        </h1>

        <div className='mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16'>
          <div className={cn('lg:col-span-7', {
              'rounded-lg border-2 border-dashed border-zinc-200 p-12 bg-white':
                isMounted && items.length === 0,
            })}>
            <h2 className='sr-only'>
              Productos en tu carrito
            </h2>

            {isMounted && items.length === 0 ? (
              <div className='flex h-full flex-col items-center justify-center space-y-1'>
                <div aria-hidden='true' className='relative mb-4 h-40 w-40 text-muted-foreground'>
                  <Image src='/hippo-empty-cart.png' fill loading='eager'alt='carrito vacio' />
                </div>
                <h3 className='font-semibold text-2xl'>
                  Tu carrito está vacío
                </h3>
                <p className='text-muted-foreground text-center'>
                  Whoops! Nada para mostrar aquí aún.
                </p>
              </div>
            ) : null}

            <ul
              className={cn({
                'divide-y divide-gray-200 border-b border-t border-gray-200 bg-white':
                  isMounted && items.length > 0,
              })}>
              {isMounted &&
                uniqueProducts.map(({ product, quantity }, index) => {

                  const image= product.images[0]

                  return (
                    <li
                      key={product.id+index}
                      className='flex py-6 sm:py-10'>
                      <div className='flex-shrink-0'>
                        <div className='relative h-24 w-24'>
                          {image.url ? (
                            <Image
                              fill
                              src={image.url}
                              alt='product image'
                              className='h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48'
                            />
                          ) : null}
                        </div>
                      </div>

                      <div className='ml-4 flex flex-1 flex-col justify-between sm:ml-6'>
                        <div className='relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0'>
                          <div>
                            <div className='flex justify-between'>
                              <h3 className='text-sm'>
                                <Link
                                  href={`/${product.category.slug}/${product.slug}`}
                                  className='font-medium text-gray-700 hover:text-gray-800'>
                                  {product.name}
                                </Link>
                              </h3>
                            </div>

                            <div className='mt-1 flex text-sm'>
                              <p className='text-muted-foreground'>
                                {product.category.name}
                              </p>
                            </div>

                            <div className='flex items-center justify-between max-w-56'>
                              <p className='text-sm font-medium text-gray-900'>
                                {formatPrice(product.price)} {quantity > 1 ? `x ${quantity}` : ''}
                              </p>

                              <div className='flex items-center'>
                                { quantity > 1 &&
                                  <Button className='px-2' variant="ghost" onClick={() => removeItem(product.id)}> 
                                    <MinusCircle className='w-4 h-4' />
                                  </Button>
                                }
                                  <Button className='px-2' variant="ghost" onClick={() => addItem(product)}>
                                      <PlusCircle className='w-4 h-4' />
                                  </Button>
                              </div>

                            </div>

                          </div>

                          <div className='mt-4 sm:mt-0 sm:pr-9 w-20'>
                            <div className='absolute right-0 top-0'>
                              <Button
                                aria-label='remove product'
                                onClick={() =>
                                  removeAllOf(product.id)
                                }
                                variant='ghost'>
                                <X
                                  className='h-5 w-5'
                                  aria-hidden='true'
                                />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <p className='mt-4 flex space-x-2 text-sm text-gray-700'>
                          <Check className='h-5 w-5 flex-shrink-0 text-green-500' />

                          <span>
                            Entrega rápida
                          </span>
                        </p>
                      </div>
                    </li>
                  )
                })}
            </ul>
            <div className='mt-6'>
              <Link href="/checkout/datos-de-envio">
                <Button className='w-full' size='lg' disabled={items.length === 0 || loading}>
                  {loading ? (
                    <Loader2 className='w-4 h-4 animate-spin mr-1.5' />
                  ) : null}
                  Continuar (Medio de pago)
                </Button>
              </Link>
            </div>

          </div>
          <div className='lg:col-span-5 lg:mt-0 mt-10'>
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  )
}


