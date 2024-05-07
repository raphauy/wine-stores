"use client"

import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import { ImageDAO } from '@/services/image-services'
import { ImageIcon, MinusCircle, Plus, PlusCircle, X } from 'lucide-react'
import Image from 'next/image'
import { ProductQuantity } from './Cart'

type Props= {
  product: ProductQuantity
}
export default function CartItem({ product: productQuantity }: Props) {
  const image: ImageDAO= productQuantity.product.images[0]

  const { addItem,removeItem } = useCart()

  const category= productQuantity.product.category

  const label = category?.name || 'Unknown'

  return (
    <div className='space-y-3 py-2'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-center space-x-4'>
          <div className='relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded'>
            {typeof image !== 'string' && image.url ? (
              <Image
                src={image.url}
                alt={productQuantity.product.name}
                fill
                className='absolute object-cover'
              />
            ) : (
              <div className='flex h-full items-center justify-center bg-secondary'>
                <ImageIcon
                  aria-hidden='true'
                  className='h-4 w-4 text-muted-foreground'
                />
              </div>
            )}
          </div>

          <div className='flex flex-col self-start'>
            <span className='line-clamp-1 text-sm font-medium mb-1'>
              {productQuantity.product.name}
            </span>

            <span className='line-clamp-1 text-xs capitalize text-muted-foreground'>
              {label}
            </span>

            <div className='mt-4 text-xs text-muted-foreground flex items-center gap-4'>
              <button
                onClick={() => removeItem(productQuantity.product.id)}
                className='flex items-center gap-0.5'>
                
                { productQuantity.quantity > 1 ? 
                <MinusCircle className='w-4 h-4' />
                : 
                <><X className='w-3 h-4' /><p>Quitar</p></>
                }
              </button>
              <button
                onClick={() => addItem(productQuantity.product)}
                className='flex items-center gap-0.5'>
                  <PlusCircle className='w-4 h-4' />                  
              </button>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2 font-medium'>
          {
            productQuantity.quantity > 1 &&
            <p className='text-sm'>
              {productQuantity.quantity} x
            </p>
          }
          <span className='ml-auto line-clamp-1 text-sm'>
            {formatPrice(productQuantity.product.price)}
          </span>
        </div>
      </div>
    </div>
  )
}


