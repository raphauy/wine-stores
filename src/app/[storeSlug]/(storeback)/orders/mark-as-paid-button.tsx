"use client"

import { Button, buttonVariants } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { OrderDAO } from '@/services/order-services'
import { OrderStatus, UserRole } from '@prisma/client'
import { Loader } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { processOrderConfirmationAction } from '../../(storeback)/orders/order-actions'

type Props = {
    order: OrderDAO
}
export default function MarkAsPaidButton({ order }: Props) {
    const [loading, setLoading] = useState(false)
    const status= order.status
    const user= useSession().data?.user
    if (!user) return <div>Debes estar logueado para poder marcar como pagado</div>
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.STORE_OWNER && user.role !== UserRole.STORE_ADMIN) 
        return <div>Debes ser administrador de la tienda para poder marcar como pagado</div>

    function handleClick() {
        setLoading(true)
        processOrderConfirmationAction(order.id)
        .then(() => {
            toast({ title: "Compra pagada", description: "Se ha confirmado la recepción del pago de la compra"})
        })
        .catch((error) => {
            toast({ title: "Error", description: error.message})
        })
        .finally(() => {
            setLoading(false)
        })
    }
    if (status === OrderStatus.Paid) {
        return <div className='max-w-[350px] text-center mx-auto'>Momento de preparar el paquete.</div>
    } else if (status === OrderStatus.Pending && order.paymentMethod === "TransferenciaBancaria") {
        return <div className='max-w-[350px] text-center mx-auto'>Hay que esperar a que el cliente marque la transferencia como enviada.</div>
    } else if (status === OrderStatus.Pending && order.paymentMethod === "MercadoPago") {
        return <div className='max-w-[350px] text-center mx-auto'>Esto no debería pasar, hay que chequear en Mercadopago de forma manual. También comunicar al cliente de este inconveniente.</div>
    }

    if (status !== OrderStatus.PaymentSent)
        return null

    return (
        <div className='flex flex-col gap-2'>
            <Button variant="outline" className="" onClick={handleClick}>
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Marcar transferencia recibida"}
            </Button>
        </div>
    )
}
