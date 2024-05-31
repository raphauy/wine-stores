import { getStoreDAOBySlugAction } from "@/app/admin/stores/store-actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { completeWithZeros, getCurrentUser } from "@/lib/utils"
import { setOrderTransferenciaBancariaPending } from "@/services/core-logic"
import { getLastOrderDAOOfUser } from "@/services/order-services"
import Image from "next/image"
import Link from "next/link"
import CleanCart from "./clean-cart"

type Props = {
  params: {
    storeSlug: string
  }
  searchParams: {
    email: string
  }
}

export default async function DatosBancariosPage({ params, searchParams }: Props) {
  const email= searchParams.email
  if (!email) {
    return <div>no se encontró el email</div>
  }

  const user= await getCurrentUser()
  if (!user) {
    return <div>Para continuar debes confirmar tu email</div>
  }
  if (!user.email) {
    return <div>Para continuar debes loguearte</div>
  }

  const store= await getStoreDAOBySlugAction(params.storeSlug)
  if (!store) {
    return <div>No se encontró el store</div>
  }

  const bankData= store.bankData
  const order= await getLastOrderDAOOfUser(store.id, email)
  if (!order) {
    return <div>No se encontró una orden para el mail: {email}</div>
  }

  let emailMessage
  if (user.email !== order.email) {
    emailMessage= `Estas logueado con el email ${user.email} pero la orden que estas intentando pagar es de ${order.email}. Ten encuenta que para ver las ordenes del email ${email} debes loguearte con ese email.`
  }

  await setOrderTransferenciaBancariaPending(order.id)
  
  const items= order.orderItems
  const totalValue= items.reduce((acc, item) => acc + item.soldUnitPrice * item.quantity, 0)

  return (
    <div className="max-w-2xl mt-5 mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-black dark:text-white">
      <div className="flex items-center space-x-4 mb-6">
        <Avatar>
          <AvatarImage alt={store.name} src={store.image} />
          <AvatarFallback>Latidio</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">{store.name}</h1>
      </div>
      <h2 className="text-xl font-semibold mb-4">Orden de compra pendiente de pago</h2>
      <div className=" py-4 mb-6">
        <p className="text-lg mb-2 border rounded-md text-black bg-slate-50 px-3">Datos para realizar el pago vía transferencia bancaria:</p>
        {
          bankData.length > 0 && bankData.map((item) => (
            <div key={item.id} className="mb-2 px-3 border-b">
              <p className="font-bold">{item.name}</p>
              <p className="whitespace-pre-line">{item.info}</p>
            </div>
          ))
        }
            <div className="mt-5 px-3 text-black dark:text-white">
              <p className="font-bold">Asunto: Orden {order.store.prefix}#{completeWithZeros(order.storeOrderNumber)}</p>
            </div>
      </div>
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
          <span>TOTAL a transferir</span>
          <span>${totalValue}</span>
        </div>
      </div>
      <p className="mb-2">
        Una vez que hayas realizado el pago, debes marcar la orden como pagada en &quot;Mi cuenta&quot;.
      </p>
      {
        emailMessage && <p className="text-red-500 mb-4">{emailMessage}</p>
      }
      <Link href={`/micuenta?storeId=${store.id}&email=${order.email}`}>
        <Button className="w-full">Mi cuenta</Button>
      </Link>
      <CleanCart />
    </div>
  )
}