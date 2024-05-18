import { prisma } from "@/lib/db"
import * as z from "zod"
import { UserDAO } from "./user-services"
import { CategoryDAO } from "./category-services"

export type StoreDAO = {
	id: string
	name: string
  slug: string
	image: string | undefined
	igHandle: string | undefined
  description: string | undefined
  mpRedirectUrl: string | undefined
  mpMarketplaceFee: number
	ownerId: string | undefined
  owner: UserDAO | undefined
  categories: CategoryDAO[]
	createdAt: Date
	updatedAt: Date
}

export const storeSchema = z.object({
	name: z.string({required_error: "name is required."}),
  slug: z.string({required_error: "slug is required."}),
	image: z.string().optional(),
	igHandle: z.string().optional(),
  description: z.string().optional(),
  mpRedirectUrl: z.string().optional(),
  mpMarketplaceFee: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" })
})

export type StoreFormValues = z.infer<typeof storeSchema>


export async function getStoresDAO() {
  const found = await prisma.store.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as StoreDAO[]
}

export async function getStoreDAO(id: string) {
  const found = await prisma.store.findUnique({
    where: {
      id
    },
  })
  return found as StoreDAO
}

export async function getStoreDAOBySlug(slug: string) {
  const found = await prisma.store.findUnique({
    where: {
      slug
    },
    include: {
      categories: true,
    }
  })
  return found as StoreDAO
}
    
export async function createStore(data: StoreFormValues) {
  const mpMarketplaceFee= Number(data.mpMarketplaceFee)
  const created = await prisma.store.create({
    data: {
      ...data,
      mpMarketplaceFee,
    }
  })
  return created
}

export async function updateStore(id: string, data: StoreFormValues) {
  const mpMarketplaceFee= Number(data.mpMarketplaceFee)
  const updated = await prisma.store.update({
    where: {
      id
    },
    data: {
      ...data,
      mpMarketplaceFee,
    }
  })
  return updated
}

export async function deleteStore(id: string) {
  const deleted = await prisma.store.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullStoresDAO() {
  const found = await prisma.store.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
      owner: true
		}
  })
  return found as StoreDAO[]
}
  
export async function getFullStoreDAO(id: string) {
  const found = await prisma.store.findUnique({
    where: {
      id
    },
    include: {
      owner: true
		}
  })
  return found as StoreDAO
}
    

export async function setOwner(storeId: string, userId: string) {
  const updated = await prisma.store.update({
    where: {
      id: storeId
    },
    data: {
      ownerId: userId
    }
  })
  return updated
}