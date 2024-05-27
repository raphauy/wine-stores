"use server"
  
import { revalidatePath } from "next/cache"
import { OrderDAO, OrderFormValues, createOrder, updateOrder, getFullOrderDAO, deleteOrder, setOrderStatus, setOrderTransferenciaBancariaPaymentSent } from "@/services/order-services"
import { OrderStatus } from "@prisma/client"


export async function getOrderDAOAction(id: string): Promise<OrderDAO | null> {
    return getFullOrderDAO(id)
}

export async function createOrUpdateOrderAction(id: string | null, data: OrderFormValues): Promise<OrderDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateOrder(id, data)
    } else {
        updated= await createOrder(data)
    }     

    revalidatePath("/[storeSlug]/orders")

    return updated as OrderDAO
}

export async function deleteOrderAction(id: string): Promise<OrderDAO | null> {    
    const deleted= await deleteOrder(id)

    revalidatePath("/[storeSlug]/orders")

    return deleted as OrderDAO
}

export async function setOrderTransferenciaBancariaPaymentSentAction(id: string): Promise<OrderDAO | null> {
    const updated= await setOrderTransferenciaBancariaPaymentSent(id)

    revalidatePath("/[storeSlug]", "page")

    return updated as OrderDAO
}
