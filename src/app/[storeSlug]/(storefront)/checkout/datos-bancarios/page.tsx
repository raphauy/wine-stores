import { getStoreDAOBySlugAction } from "@/app/admin/stores/store-actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useCart } from '@/hooks/use-cart'
import { getCurrentUser } from "@/lib/utils"
import { StoreDAO } from "@/services/store-services"
import { Loader } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Props = {
  params: {
    storeSlug: string
  }
}
export default async function DatosBancariosPage({ params }: Props) {

  const user= await getCurrentUser()
  if (!user) {
    return <div>Para continuar debes confirmar tu email</div>
  }

  const store= await getStoreDAOBySlugAction(params.storeSlug)
  if (!store) {
    return <div>No se encontró el store</div>
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