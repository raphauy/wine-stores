"use server"
  
import { OrderDAO, deleteOrder, getFullOrderDAO, setOrderTransferenciaBancariaPaymentSent } from "@/services/order-services"
import { revalidatePath } from "next/cache"


export async function getOrderDAOAction(id: string): Promise<OrderDAO | null> {
    return getFullOrderDAO(id)
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
