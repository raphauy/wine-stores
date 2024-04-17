import * as z from "zod"
import { prisma } from "@/lib/db"
import { OrderDAO } from "./order-services"
import { ProductDAO } from "./product-services"

export type OrderItemDAO = {
	id: string
	order: OrderDAO
	orderId: string
	product: ProductDAO
	productId: string
}

export const orderItemSchema = z.object({
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
  // TODO: implement createOrderItem
  const created = await prisma.orderItem.create({
    data
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
			product: true,
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
			product: true,
		}
  })
  return found as OrderItemDAO
}
    