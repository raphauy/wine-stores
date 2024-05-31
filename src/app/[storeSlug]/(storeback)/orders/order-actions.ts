"use server"
  
import { processOrderConfirmation, setOrderTransferenciaBancariaPaymentSent, setOrderTransferenciaBancariaPaymentSentWithBank } from "@/services/core-logic"
import { OrderDAO, deleteOrder, getFullOrderDAO } from "@/services/order-services"
import { revalidatePath } from "next/cache"


export async function getOrderDAOAction(id: string): Promise<OrderDAO | null> {
    return getFullOrderDAO(id)
}


export async function deleteOrderAction(id: string): Promise<OrderDAO | null> {    
    const deleted= await deleteOrder(id)

    revalidatePath("/[storeSlug]/orders", "page")

    return deleted as OrderDAO
}

export async function setOrderTransferenciaBancariaPaymentSentAction(id: string): Promise<OrderDAO | null> {
    const updated= await setOrderTransferenciaBancariaPaymentSent(id)

    revalidatePath("/[storeSlug]", "page")

    return updated as OrderDAO
}

export async function setOrderTransferenciaBancariaPaymentSentWithBankAction(id: string, bankId: string, comment: string | undefined): Promise<OrderDAO | null> {   
    const updated= await setOrderTransferenciaBancariaPaymentSentWithBank(id, bankId, comment)

    revalidatePath("/[storeSlug]", "page")

    return updated as OrderDAO
}


export async function processOrderConfirmationAction(id: string): Promise<OrderDAO | null> {
    const updated= await processOrderConfirmation(id)

    revalidatePath("/[storeSlug]/orders", "page")

    return updated as OrderDAO
}