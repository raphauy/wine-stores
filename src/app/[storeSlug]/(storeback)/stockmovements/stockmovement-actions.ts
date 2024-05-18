"use server"
  
import { revalidatePath } from "next/cache"
import { StockMovementDAO, StockMovementFormValues, createStockMovement, updateStockMovement, getFullStockMovementDAO, deleteStockMovement } from "@/services/stockmovement-services"


export async function getStockMovementDAOAction(id: string): Promise<StockMovementDAO | null> {
    return getFullStockMovementDAO(id)
}

export async function createOrUpdateStockMovementAction(id: string | null, data: StockMovementFormValues): Promise<StockMovementDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateStockMovement(id, data)
    } else {
        updated= await createStockMovement(data)
    }     

    revalidatePath("/[storeSlug]/inventory", "page")

    return updated as StockMovementDAO
}

export async function deleteStockMovementAction(id: string): Promise<StockMovementDAO | null> {    
    const deleted= await deleteStockMovement(id)

    revalidatePath("/[storeSlug]/inventory", "page")

    return deleted as StockMovementDAO
}

