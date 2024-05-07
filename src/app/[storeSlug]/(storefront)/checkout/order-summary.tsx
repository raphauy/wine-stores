'use client'

import { ProductQuantity } from '@/components/Cart'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'

export const FEE = 250

export default function OrderSummary() {

  const { items, email, phone, address } = useCart()

  const cartTotal = items.reduce((total, { product }) => total + product.price,0)

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
    <section className='rounded-lg border bg-white px-4 py-6 sm:p-6'>
      <h2 className='text-lg font-medium text-gray-900'>
        Resumen de la orden
      </h2>

      <div className='mt-6 space-y-4'>
        <div className='flex items-center justify-between'>
          <p className='text-sm text-gray-600'>
            Subtotal
          </p>
          <p className='text-sm font-medium text-gray-900'>
            {formatPrice(cartTotal)}
          </p>
        </div>

        <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
          <div className='flex items-center text-sm text-muted-foreground'>
            <span>Envío</span>
          </div>
          <div className='text-sm font-medium text-gray-900'>
            {(
              FEE > 0 && cartTotal > 0? formatPrice(FEE) 
              :
              <p>Gratis</p>
            )}
          </div>
        </div>

        <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
          <div className='text-base font-medium text-gray-900'>
            Total
          </div>
          <div className='text-base font-medium text-gray-900'>
            {formatPrice(cartTotal + FEE)}
          </div>
        </div>
      </div>

    </section>
  )
}


