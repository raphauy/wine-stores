"use server"
  
import { revalidatePath } from "next/cache"
import { OrderItemDAO, OrderItemFormValues, createOrderItem, updateOrderItem, getFullOrderItemDAO, deleteOrderItem } from "@/services/orderitem-services"


export async function getOrderItemDAOAction(id: string): Promise<OrderItemDAO | null> {
    return getFullOrderItemDAO(id)
}

export async function createOrUpdateOrderItemAction(id: string | null, data: OrderItemFormValues): Promise<OrderItemDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateOrderItem(id, data)
    } else {
        updated= await createOrderItem(data)
    }     

    revalidatePath("/[storeSlug]/orderItems")

    return updated as OrderItemDAO
}

export async function deleteOrderItemAction(id: string): Promise<OrderItemDAO | null> {    
    const deleted= await deleteOrderItem(id)

    revalidatePath("/[storeSlug]/orderItems")

    return deleted as OrderItemDAO
}

