"use server"
  
import { revalidatePath } from "next/cache"
import { InventoryItemDAO, InventoryItemFormValues, createInventoryItem, updateInventoryItem, getFullInventoryItemDAO, deleteInventoryItem } from "@/services/inventoryitem-services"

import { StockMovementDAO } from "@/services/stockmovement-services"
    

export async function getInventoryItemDAOAction(id: string): Promise<InventoryItemDAO | null> {
    return getFullInventoryItemDAO(id)
}

export async function createOrUpdateInventoryItemAction(id: string | null, data: InventoryItemFormValues): Promise<InventoryItemDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateInventoryItem(id, data)
    } else {
        updated= await createInventoryItem(data)
    }     

    revalidatePath("/(storeback)/inventoryitems")

    return updated as InventoryItemDAO
}

export async function deleteInventoryItemAction(id: string): Promise<InventoryItemDAO | null> {    
    const deleted= await deleteInventoryItem(id)

    revalidatePath("/(storeback)/inventoryitems")

    return deleted as InventoryItemDAO
}
    

