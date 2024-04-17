"use server"
  
import { revalidatePath } from "next/cache"
import { OrderDAO, OrderFormValues, createOrder, updateOrder, getFullOrderDAO, deleteOrder } from "@/services/order-services"


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

