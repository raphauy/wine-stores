"use client"

import { Button, buttonVariants } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from '@/components/ui/use-toast'
import { cn, completeWithZeros } from '@/lib/utils'
import { OrderDAO } from '@/services/order-services'
import { OrderStatus, PaymentMethod } from '@prisma/client'
import { Info, Loader } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { setOrderTransferenciaBancariaPaymentSentAction } from '../../(storeback)/orders/order-actions'
import { MarkAsPaidDialog } from './bank-form-and-dialog'

type Props = {
    order: OrderDAO
}
export default function MarkAsPaymentSentButton({ order }: Props) {
    const [loading, setLoading] = useState(false)
    const status= order.status
    // const user= useSession().data?.user
    // if (!user) return <div>Debes estar logueado para poder marcar como pagado</div>
    // if (user.email !== order.email) return <div>No puedes marcar como pagado si la orden no es de tu cuenta</div>

    function handleClick() {
        setLoading(true)
        setOrderTransferenciaBancariaPaymentSentAction(order.id)
        .then(() => {
            toast({ title: "Compra pagada", description: "La compra ha sido marcada como pagada"})
        })
        .catch((error) => {
            toast({ title: "Error", description: error.message})
        })
        .finally(() => {
            setLoading(false)
        })
    }
    if (status === OrderStatus.PaymentSent) {
        return <div className='max-w-[350px] text-center mx-auto'>En breve nos pondremos en contacto contigo para confirmarte la recepción de la transferencia.</div>
    } else if (status === OrderStatus.Paid) {
        return <div className='max-w-[350px] text-center mx-auto'>En breve nos pondremos en contacto contigo con información del envío.</div>
    }

    if (status !== OrderStatus.Pending) 
        return null

    if (order.paymentMethod !== PaymentMethod.TransferenciaBancaria)
        return null

    const bankDataStr= order.store.bankData.map((item) => item.name + "\n" + item.info).join("\n\n")
    return (
        <div className='flex flex-col gap-2'>
            {/* <Button variant="outline" className="" onClick={handleClick}>
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Marcar transferencia enviada"}
            </Button> */}

            <MarkAsPaidDialog storeId={order.store.id} orderId={order.id} />
            <Popover>
                <PopoverTrigger>
                    <div className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full gap-2")} ><Info className='w-4 h-4' /><p>Ver datos bancarios</p></div>
                </PopoverTrigger>
                <PopoverContent className='w-full'>
                    <div className="p-4 bg-white rounded-md dark:bg-gray-800">
                        <p className="text-lg font-bold border-b">Datos bancarios</p>
                        <div className="mt-4 text-sm whitespace-pre-line">
                            {bankDataStr}
                        </div>
                        <div className="mt-4 text-sm whitespace-pre-line border-t font-bold pt-4">
                            Asunto: Orden {order.store.prefix}#{completeWithZeros(order.storeOrderNumber)}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
