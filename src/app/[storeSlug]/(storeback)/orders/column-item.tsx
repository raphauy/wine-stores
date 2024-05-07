"use client"

import { formatPrice } from '@/lib/utils'
import { ImageDAO } from '@/services/image-services'
import { OrderItemDAO } from '@/services/orderitem-services'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'

type Props= {
  item: OrderItemDAO
}
export default function ColumnItem({ item }: Props) {

  return (
    <div className='space-y-3 py-2'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-center space-x-4'>
          <div className='relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded'>
            {item.soldImage ? (
              <Image
                src={item.soldImage}
                alt={item.soldName}
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
              {item.soldName}
            </span>

            <span className='line-clamp-1 text-xs capitalize text-muted-foreground'>
              {item.soldCategory}
            </span>

            <div className='flex items-center gap-2 font-medium'>
              {
                item.quantity > 1 &&
                <p className='text-sm'>
                  {item.quantity} x
                </p>
              }
              <span className='line-clamp-1 text-sm'>
                {formatPrice(item.soldUnitPrice)}
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}


