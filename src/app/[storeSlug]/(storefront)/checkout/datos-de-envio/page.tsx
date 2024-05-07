'use client'

import { ProductQuantity } from '@/components/Cart'
import { useCart } from '@/hooks/use-cart'
import { DatosEnvioFormValues } from '@/services/order-services'
import { useRouter } from 'next/navigation'
import { OrderForm } from '../../../(storeback)/orders/order-forms'
import OrderSummary from '../order-summary'


export default function Page() { 
  const { items, setEmail, setPhone, setAddress } = useCart()

  const router= useRouter()

  function setData(data: DatosEnvioFormValues) {
    setEmail(data.email)
    setPhone(data.phone || '')
    setAddress(data.address)

    router.push('/checkout/medio-de-pago')
  }

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
          Datos de envío (2/3)
        </h1>

        <div className='mt-10 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16 '>
          <div className="lg:col-span-7 bg-white p-10 border">
            <OrderForm setData={setData} />
          </div>

          <div className='lg:col-span-5 lg:mt-0 mt-10'>
            <OrderSummary />
          </div>

        </div>
      </div>
    </div>
  )
}


