'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from './ui/skeleton'
import Link from 'next/link'
import { cn, formatPrice } from '@/lib/utils'
//import ImageSlider from './ImageSlider'
import { ProductDAO } from '@/services/product-services'
import { CategoryDAO } from '@/services/category-services'
import ImageSlider from './ImageSlider'

interface ProductListingProps {
  product: ProductDAO | null
  index: number
  isSubdomain: boolean  
}

export default function ProductListing({ product, index, isSubdomain }: ProductListingProps) {  
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 75)

    return () => clearTimeout(timer)
  }, [index])

  if (!product || !isVisible) return <ProductPlaceholder />

  const validUrls = product.images.map((image) => image.url)

  if (isVisible && product) {
    const href= isSubdomain ? `/${product.category.slug}/${product.slug}` : `/${product.store.slug}/${product.category.slug}/${product.slug}`
    return (
      <Link href={href}
        className={cn('invisible h-full w-full cursor-pointer group/main',
          {
            'visible animate-in fade-in-5': isVisible,
          }
        )}
      >
        <div className='flex flex-col w-full'>
          <ImageSlider urls={validUrls} />

          <h3 className='mt-4 font-medium text-gray-700 dark:text-white'>
            {product.name}
          </h3>
          <p className='mt-1 text-sm text-gray-500 dark:text-white'>
            {product.category.name}
          </p>
          {
            product.discountPrice ?
            <>
              <p className='mt-1 font-medium text-sm line-through text-red-600 dark:text-white'>
                {formatPrice(product.price)}
              </p>
              <p className='mt-1 font-medium text-sm text-gray-900 dark:text-white'>
                {formatPrice(product.discountPrice)}
              </p>
            </>
              :
              <p className='mt-1 font-medium text-sm text-gray-900 dark:text-white'>
                {formatPrice(product.price)}
              </p>
            }
          </div>
      </Link>
    )
  }
}

const ProductPlaceholder = () => {
  return (
    <div className='flex flex-col w-full'>
      <div className='relative bg-zinc-200 w-full aspect-botella overflow-hidden rounded-xl'>
        <Skeleton className='h-full w-full' />
      </div>
      <Skeleton className='mt-4 w-2/3 h-4 rounded-lg bg-zinc-200' />
      <Skeleton className='mt-2 w-16 h-4 rounded-lg bg-zinc-200' />
      <Skeleton className='mt-2 w-12 h-4 rounded-lg bg-zinc-200' />
    </div>
  )
}


