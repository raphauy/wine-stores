import * as z from "zod"
import { prisma } from "@/lib/db"
import { OrderDAO } from "./order-services"
import { ProductDAO, getProductDAO } from "./product-services"

export type OrderItemDAO = {
	id: string
  quantity: number
	soldUnitPrice: number
  soldName: string
	soldCategory: string
  soldImage: string
	order: OrderDAO
	orderId: string
	productId: string
}

export const orderItemSchema = z.object({
  quantity: z.number().min(1, "quantity is required."),
	orderId: z.string().min(1, "orderId is required."),
	productId: z.string().min(1, "productId is required."),
})

export type OrderItemFormValues = z.infer<typeof orderItemSchema>


export async function getOrderItemsDAO() {
  const found = await prisma.orderItem.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as OrderItemDAO[]
}

export async function getOrderItemDAO(id: string) {
  const found = await prisma.orderItem.findUnique({
    where: {
      id
    },
  })
  return found as OrderItemDAO
}
    
export async function createOrderItem(data: OrderItemFormValues) {
  const product= await getProductDAO(data.productId)
  if (!product) {
    throw new Error("Product not found")
  }
  const soldImage= product.images.length > 0 ? product.images[0].url : ""
  const created = await prisma.orderItem.create({
    data: {
      ...data,
      soldUnitPrice: product.price,
      soldName: product.name,
      soldCategory: product.category.name,
      soldImage,
    },
  })
  return created
}

export async function updateOrderItem(id: string, data: OrderItemFormValues) {
  const updated = await prisma.orderItem.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteOrderItem(id: string) {
  const deleted = await prisma.orderItem.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullOrderItemsDAO() {
  const found = await prisma.orderItem.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			order: true,
		}
  })
  return found as OrderItemDAO[]
}
  
export async function getFullOrderItemDAO(id: string) {
  const found = await prisma.orderItem.findUnique({
    where: {
      id
    },
    include: {
			order: true,
		}
  })
  return found as OrderItemDAO
}
    