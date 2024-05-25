'use client'

import { StoreDAO, getStoreDAOBySlug } from "@/services/store-services"
import { useCart } from '@/hooks/use-cart'
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getStoreDAOAction, getStoreDAOBySlugAction } from "@/app/admin/stores/store-actions"


export default function DatosBancariosPage() {

  const { clearCart } = useCart()
  const params= useParams()

  const storeSlug= params.storeSlug as string

  const [store, setStore] = useState<StoreDAO | null>(null)

  useEffect(() => {
    getStoreDAOBySlugAction(storeSlug)
      .then((store) => {
        setStore(store)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [storeSlug])

  useEffect(() => {
    clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='w-full p-10'>
      <div className="container bg-white dark:bg-black p-10 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <h2 className='text-2xl font-bold'>Datos bancarios:</h2>

        {store && store.bankData.map((bank) => (
          <div key={bank.id} className='flex flex-col gap-2 mt-10 border-b'>
            <div className='text-lg font-bold'>{bank.name}</div>
            <div className='text-sm text-muted-foreground whitespace-pre-line'>{bank.info}</div>
          </div>
        ))}
      </div>
    </div>
  )
}


