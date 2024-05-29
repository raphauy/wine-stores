import * as z from "zod"
import { prisma } from "@/lib/db"
import { ProductDAO } from "./product-services"
import { StoreDAO } from "./store-services"
import { StockMovementDAO } from "./stockmovement-services"
import { getStockMovementsDAO } from "./stockmovement-services"

export type InventoryItemDAO = {
	id: string
	quantity: number
	product: ProductDAO
	productId: string
	store: StoreDAO
	storeId: string
	stockMovements: StockMovementDAO[]
	createdAt: Date
	updatedAt: Date
}

export const inventoryItemSchema = z.object({
	quantity: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	productId: z.string().min(1, "productId is required."),
	storeId: z.string().min(1, "storeId is required."),
})

export type InventoryItemFormValues = z.infer<typeof inventoryItemSchema>


export async function getInventoryItemsDAO(storeSlug: string) {
  const found = await prisma.inventoryItem.findMany({
    where: {
      store: {
        slug: storeSlug
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
  })
  return found as InventoryItemDAO[]
}

export async function getInventoryItemDAO(id: string) {
  const found = await prisma.inventoryItem.findUnique({
    where: {
      id
    },
  })
  return found as InventoryItemDAO
}
    
export async function createInventoryItem(data: InventoryItemFormValues) {
  const quantity = data.quantity ? Number(data.quantity) : 0

  const created = await prisma.inventoryItem.create({
    data: {
      ...data,
      quantity
    }
  })
  return created
}

export async function updateInventoryItem(id: string, data: InventoryItemFormValues) {
  const quantity = data.quantity ? Number(data.quantity) : 0
  const updated = await prisma.inventoryItem.update({
    where: {
      id
    },
    data: {
      ...data,
      quantity
    }
  })
  return updated
}

export async function deleteInventoryItem(id: string) {
  const deleted = await prisma.inventoryItem.delete({
    where: {
      id
    },
  })
  return deleted
}
    

export async function getFullInventoryItemsDAO(storeSlug: string): Promise<InventoryItemDAO[]> {
  const found = await prisma.inventoryItem.findMany({
    where: {
      store: {
        slug: storeSlug
      }
    },
    orderBy: {
      id: 'asc'
    },
    include: {
			product: { 
        include: { 
          category: true,
          images: true
        } 
      },
			store: true,
			stockMovements: true,
		}
  })
  return found as InventoryItemDAO[]
}
  
export async function getFullInventoryItemDAO(id: string) {
  const found = await prisma.inventoryItem.findUnique({
    where: {
      id
    },
    include: {
			product: true,
			store: true,
			stockMovements: true,
		}
  })
  return found as InventoryItemDAO
}


export async function getInventoryItemDAOByProductId(productId: string) {
  const found = await prisma.inventoryItem.findUnique({
    where: {
      productId
    },
    include: {
			product: true,
			store: true,
			stockMovements: {
        orderBy: {
          createdAt: 'desc'
        },
      }
		}
  })
  return found as InventoryItemDAO
}

export async function getLastInventoryItemDAO(storeSlug: string) {
  const found = await prisma.inventoryItem.findFirst({
    where: {
      store: {
        slug: storeSlug
      }
    },
    orderBy: {
      createdAt: 'asc'
    },
    include: {
			product: true,
			store: true,
			stockMovements: {
        orderBy: {
          createdAt: 'desc'
        },
      }
		}
  })
  return found as InventoryItemDAO
}