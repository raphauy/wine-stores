import { getStoreDAOBySlugAction } from "@/app/admin/stores/store-actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useCart } from '@/hooks/use-cart'
import { completeWithZeros } from "@/lib/utils"
import { getFullOrderDAO, getOrderDAO } from "@/services/order-services"
import Image from "next/image"
import Link from "next/link"
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import CleanCart from "../datos-bancarios/clean-cart"

type Props = {
  params: {
    storeSlug: string
  }
  searchParams: {
    collection_status: string
    external_reference: string
  }
}
export default async function PagoConfirmadoPage({ params, searchParams }: Props) {

  const storeSlug = params.storeSlug as string
  const store= await getStoreDAOBySlugAction(storeSlug)
  if (!store) {
    return <div>Algo salió mal (SNF)</div>
  }
  const orderId = searchParams.external_reference
  const order = await getFullOrderDAO(orderId)
  if (!order) {
    return <div>Algo salió mal (ONF)</div>
  }

  const items = order.orderItems
  const totalValue= items.reduce((acc, item) => acc + item.soldUnitPrice * item.quantity, 0)

  const status= searchParams.collection_status

  if (status === "pending") {
    return (
      <div className='w-full'>
        <div className='mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
            Pago pendiente...
          </h1>
        </div>
      </div>
    )
  } else if (status === "approved") {
    return (
      <div className="max-w-2xl mt-5 mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-black dark:text-white">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar>
            <AvatarImage alt={store.name} src={store.image} />
            <AvatarFallback>Latidio</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">{store.name}</h1>
        </div>
        <h2 className="text-xl font-semibold mb-4">Confirmación de Mercadopago, tu pago ha finalizado con éxito</h2>
        <div className="py-4 mb-6">
          <p className="text-lg mb-2 border rounded-md text-black bg-slate-50 px-3">Detalle de la compra:</p>
            {
              items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Image alt={item.soldName} className="rounded-lg border" height="50" src={item.soldImage} 
                      width="80"
                    />
                    <div>
                      <p className="font-semibold">{item.soldName}</p>
                      <p className="text-sm">{item.soldCategory}</p>
                    </div>
                  </div>
                <p className="text-lg">{item.quantity > 1 ? `(${item.quantity} x)` : ""} ${item.soldUnitPrice}</p>
  
              </div>
              ))
            }
            <div className="flex justify-between items-center mt-4 font-bold text-lg">
            <span>TOTAL</span>
            <span>${totalValue}</span>
          </div>
        </div>
        <p className="mb-4">
          Puedes ver el estado de tus compras en &quot;Mi cuenta&quot;.
        </p>
        <Link href={`/micuenta?storeId=${store.id}&email=${order.email}`}>
          <Button className="w-full">Mi cuenta</Button>
        </Link>
        <CleanCart />
      </div>
    )
  }


  return (
    <div className='w-full'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
          Algo salió mal con el pago.
        </h1>
    </div>
  )
}


