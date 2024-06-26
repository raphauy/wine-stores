'use client'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { useCart } from '@/hooks/use-cart'
import { PaymentMethod } from '@prisma/client'
import { Loader } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { createOrderAction } from '../actions'
import OrderSummary from '../order-summary'
import SendData from '../send-data'

export default function Page() { 

  const params = useParams()
  const storeSlug = params.storeSlug as string

  const { items, email, name, address, city, phone } = useCart()
  const [loadingMP, setLoadingMP] = useState(false)
  const [loadingTB, setLoadingTB] = useState(false)
  const [loadingRC, setLoadingRC] = useState(false)


  function handleCheckout(paymentMethod: PaymentMethod) {
    if (!storeSlug) {
      toast({ title: 'Store no encontrado', description: 'Ocurrió un error, por favor intenta nuevamente.' }) 
      return
    }
    switch (paymentMethod) {
      case PaymentMethod.MercadoPago:
        setLoadingMP(true)
        break
      case PaymentMethod.TransferenciaBancaria:
        setLoadingTB(true)
        break
      case PaymentMethod.RedesDeCobranza:
        setLoadingRC(true)
        break
    }
    createOrderAction(paymentMethod, storeSlug, items, email, name, address, city, phone)
    .then(() => {
        toast({ title: 'Estamos procesando su pedido...' })
    })
    .catch((err) => {
        toast({ title: 'Hubo un error', description: err.message })
    })
    .finally(() => {
        setLoadingMP(false)
        setLoadingTB(false)
        setLoadingRC(false)
    })
  }

  return (
    <div className=''>
      <div className='mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
          Medio de pago (3/3)
        </h1>

        <div className='mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16 '>
          <div className="lg:col-span-7 bg-white p-10 border dark:bg-black dark:text-white">
            <div className='space-y-10'>
              <p className=''>
                  Selecciona el método de pago que desea utilizar para finalizar la compra:
              </p>
              <Button variant="outline" className="h-16 w-full" onClick={() => handleCheckout(PaymentMethod.MercadoPago)}>
                  {
                      loadingMP ? 
                      <Loader className="animate-spin" /> 
                      :
                      <Image src="/version-horizontal-large.png" alt="mercadopago" width={200} height={50} />                       
                  }
              </Button>
              <Button variant="outline" className="h-16 w-full gap-2" onClick={() => handleCheckout(PaymentMethod.TransferenciaBancaria)}>
                {
                    loadingTB ?
                    <Loader className="animate-spin" />
                    :
                    <>
                      <p className="text-xl font-bold text-black dark:text-white">Transferencia bancaria</p>
                    </>  
                }
              </Button>
              {/* <Button variant="outline" className="h-16 w-full gap-2" onClick={() => handleCheckout(PaymentMethod.RedesDeCobranza)}>
                {
                    loadingRC ?
                    <Loader className="animate-spin" />
                    :
                    <>
                      <Image src="/redes-de-cobranzas.5vm" alt="redes de cobranza" width={90} height={50} />
                      <p className="text-xl font-bold">Redes de cobranza</p>
                    </>
                  }
              </Button> */}
            </div>
          </div>


          <div className='lg:col-span-5 lg:mt-0 mt-10'>
            <OrderSummary />
            <SendData />
          </div>

        </div>
      </div>
    </div>
  )
}


