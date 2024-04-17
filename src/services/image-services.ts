import * as z from "zod"
import { prisma } from "@/lib/db"
import { ProductDAO } from "./product-services"

export type ImageDAO = {
	id: string
	url: string
	createdAt: Date
	updatedAt: Date
	product: ProductDAO
	productId: string
}

export const imageSchema = z.object({
	url: z.string().min(1, "url is required."),
	productId: z.string().min(1, "productId is required."),
})

export type ImageFormValues = z.infer<typeof imageSchema>


export async function getImagesDAO(storeId: string) {
  const found = await prisma.image.findMany({
    orderBy: {
      id: 'asc'
    },
    where: {
      product: {
        storeId
      }
    }
  })
  return found as ImageDAO[]
}

export async function getImageDAO(id: string) {
  const found = await prisma.image.findUnique({
    where: {
      id
    },
  })
  return found as ImageDAO
}
    
export async function createImage(data: ImageFormValues) {
  // TODO: implement createImage
  const created = await prisma.image.create({
    data
  })
  return created
}

export async function updateImage(id: string, data: ImageFormValues) {
  const updated = await prisma.image.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteImage(id: string) {
  const deleted = await prisma.image.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullImagesDAO() {
  const found = await prisma.image.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			product: true,
		}
  })
  return found as ImageDAO[]
}
  
export async function getFullImageDAO(id: string) {
  const found = await prisma.image.findUnique({
    where: {
      id
    },
    include: {
			product: true,
		}
  })
  return found as ImageDAO
}
    