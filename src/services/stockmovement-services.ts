import * as z from "zod"
import { prisma } from "@/lib/db"
import { InventoryItemDAO } from "./inventoryitem-services"
import { MovementType } from "@prisma/client"

export type StockMovementDAO = {
	id: string
	type: MovementType
	quantity: number
	comment: string | undefined
	inventoryItem: InventoryItemDAO
	inventoryItemId: string
	createdAt: Date
	updatedAt: Date
}

export const stockMovementSchema = z.object({
  type: z.nativeEnum(MovementType),
	quantity: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	comment: z.string().optional(),
	inventoryItemId: z.string().min(1, "inventoryItemId is required."),
})

export type StockMovementFormValues = z.infer<typeof stockMovementSchema>


export async function getStockMovementsDAO() {
  const found = await prisma.stockMovement.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as StockMovementDAO[]
}

export async function getStockMovementsDAOByInventoryItemId(inventoryItemId: string) {
  const found = await prisma.stockMovement.findMany({
    where: {
      inventoryItemId
    },
    orderBy: {
      updatedAt: 'desc'
    },
  })
  return found as StockMovementDAO[]
}

export async function getStockMovementDAO(id: string) {
  const found = await prisma.stockMovement.findUnique({
    where: {
      id
    },
  })
  return found as StockMovementDAO
}
    
export async function createStockMovement(data: StockMovementFormValues) {
  const quantity= data.quantity ? Number(data.quantity) : 0

  const created = await prisma.stockMovement.create({
    data:{
      ...data,
      quantity,
    }    
  })
  await updateQuantityStockMovement(created.inventoryItemId)

  return created
}
export async function updateQuantityStockMovement(inventoryItemId: string) {
  // iterate over all stock movements of the inventory item and update the quantity
  const stockMovements = await getStockMovementsDAOByInventoryItemId(inventoryItemId)
  let quantity = 0
  for (const stockMovement of stockMovements) {
    if (stockMovement.type === MovementType.ENTRADA) {
      quantity += stockMovement.quantity
    } else if (stockMovement.type === MovementType.SALIDA) {
      quantity -= stockMovement.quantity
    }
  }
  const updated = await prisma.inventoryItem.update({
    where: {
      id: inventoryItemId
    },
    data: {
      quantity
    }
  })

  return quantity
}

export async function updateStockMovement(id: string, data: StockMovementFormValues) {
  const quantity= data.quantity ? Number(data.quantity) : 0
  const updated = await prisma.stockMovement.update({
    where: {
      id
    },
    data: {
      ...data,
      quantity,
    }
  })
  await updateQuantityStockMovement(updated.inventoryItemId)

  return updated
}

export async function deleteStockMovement(id: string) {
  const deleted = await prisma.stockMovement.delete({
    where: {
      id
    },
  })
  await updateQuantityStockMovement(deleted.inventoryItemId)
  
  return deleted
}


export async function getFullStockMovementsDAO() {
  const found = await prisma.stockMovement.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			inventoryItem: true,
		}
  })
  return found as StockMovementDAO[]
}
  
export async function getFullStockMovementDAO(id: string) {
  const found = await prisma.stockMovement.findUnique({
    where: {
      id
    },
    include: {
			inventoryItem: true,
		}
  })
  return found as StockMovementDAO
}
    