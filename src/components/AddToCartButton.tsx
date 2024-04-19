'use client'

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
//import { useCart } from '@/hooks/use-cart'
import { ProductDAO } from '@/services/product-services'
import { useCart } from '@/hooks/use-cart'

type Props= {
  product: ProductDAO
}
export default function AddToCartButton({ product }: Props) {

  const { addItem } = useCart()
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [isSuccess])

  return (
    <Button
      onClick={() => {
        addItem(product)
        setIsSuccess(true)
      }}
      size='lg'
      className='w-full'>
      {isSuccess ? '¡Producto agregado al carrito!' : 'Agregar al carrito'}
    </Button>
  )
}


