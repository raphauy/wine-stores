'use client'

import { getStoreDAOBySlugAction } from "@/app/admin/stores/store-actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useCart } from '@/hooks/use-cart'
import { StoreDAO } from "@/services/store-services"
import { Loader } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function DatosBancariosPage() {

  const { clearCart } = useCart()
  const user= useSession()?.data?.user
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

  if (!store) {
    return <Loader className="h-7 w-7 animate-spin" />
  }

  if (!user) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-10">
        <p>Para continuar debes confirmar tu email</p>
        <Link href="/auth/login">
          <Button variant="outline">Confirmar email</Button>
        </Link>
      </div>
    )
  }

  const bankData= store.bankData

  return (
    <div className="max-w-2xl mt-5 mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-4 mb-6">
        <Avatar>
          <AvatarImage alt={store.name} src={store.image} />
          <AvatarFallback>Latidio</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">{store.name}</h1>
      </div>
      <h2 className="text-xl font-semibold mb-4">Orden de compra pendiente de pago</h2>
      <div className="border-t border-b py-4 mb-6">
        <h3 className="text-lg font-medium mb-2">Datos para realizar el pago vía transferencia bancaria:</h3>
        {
          bankData.length > 0 && bankData.map((item) => (
            <div key={item.id} className="mb-2">
              <p className="font-bold">{item.name}</p>
              <p className="whitespace-pre-line">{item.info}</p>
            </div>
          ))
        }
      </div>
      <div className="border-t border-b py-4 mb-6">
        <h3 className="text-lg font-medium mb-2">Detalle de la compra:</h3>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Image
              alt="Libro"
              className="rounded"
              height="50"
              src="/placeholder.svg"
              style={{
                aspectRatio: "50/50",
                objectFit: "cover",
              }}
              width="50"
            />
            <div>
              <p className="font-semibold">Uruguay en Vinos</p>
              <p>Libros</p>
              <Button className="mt-2" variant="outline">
                Volver a comprar
              </Button>
            </div>
          </div>
          <p className="font-bold text-lg">$1490</p>
        </div>
        <div className="flex justify-between items-center mt-4 font-bold text-lg">
          <span>TOTAL a transferir</span>
          <span>$1490</span>
        </div>
      </div>
      <p className="mb-4">
        Una vez que hayas realizado el pago, debes ingresar a Mi cuenta y marcar la orden como pagada.
      </p>
      <Button>Mi cuenta</Button>
    </div>
  )
}