'use client'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { useCart } from '@/hooks/use-cart'
import { PaymentMethod } from '@prisma/client'
import { Loader } from 'lucide-react'
import Image from 'next/image'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createOrderAction } from '../actions'
import OrderSummary from '../order-summary'
import SendData from '../send-data'

export default function PagoConfirmadoPage() { 

  const { clearCart } = useCart()
  const [status, setStatus] = useState("")

  const params = useParams()
  const storeSlug = params.storeSlug as string

  const searchParams= useSearchParams()

  useEffect(() => {
    const status= searchParams.get('status')
    if (status) {
      const paiment_id = searchParams.get('payment_id')
      const external_reference= searchParams.get('external_reference')
      const merchant_order_id= searchParams.get('merchant_order_id')
      console.log("PagoConfirmadoPage", paiment_id, status, external_reference, merchant_order_id)
      setStatus(status)
      if (status === "approved") {
        clearCart()
      }
    
    }
  }, [searchParams, clearCart])
  


  return (
    <div className=''>
      <div className='mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8'>
        {
          status === "approved" ? 
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
            Pago finalizado con éxito!!!
          </h1>
        :
        status === "pending" ? 
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
            Pago pendiente...
          </h1>
        :
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
            Algo salió mal con el pago.
          </h1>
        }
      </div>
    </div>
  )
}


