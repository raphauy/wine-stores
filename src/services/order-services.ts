import * as z from "zod"
import { prisma } from "@/lib/db"
import { StoreDAO } from "./store-services"
import { is } from "date-fns/locale"

export type OrderDAO = {
	id: string
	isPaid: boolean
	phone: string
	address: string
	createdAt: Date
	updatedAt: Date
	store: StoreDAO
	storeId: string
}

export const orderSchema = z.object({
	isPaid: z.boolean().optional(),
	phone: z.string().min(1, "phone is required."),
	address: z.string().min(1, "address is required."),
	storeId: z.string().min(1, "storeId is required."),
})

export type OrderFormValues = z.infer<typeof orderSchema>


export async function getOrdersDAO() {
  const found = await prisma.order.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as OrderDAO[]
}

export async function getOrderDAO(id: string) {
  const found = await prisma.order.findUnique({
    where: {
      id
    },
  })
  return found as OrderDAO
}
    
export async function createOrder(data: OrderFormValues) {
  // TODO: implement createOrder
  const created = await prisma.order.create({
    data
  })
  return created
}

export async function updateOrder(id: string, data: OrderFormValues) {
  const updated = await prisma.order.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteOrder(id: string) {
  const deleted = await prisma.order.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullOrdersDAO() {
  const found = await prisma.order.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			store: true,
		}
  })
  return found as OrderDAO[]
}
  
export async function getFullOrderDAO(id: string) {
  const found = await prisma.order.findUnique({
    where: {
      id
    },
    include: {
			store: true,
		}
  })
  return found as OrderDAO
}
    