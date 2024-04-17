import * as z from "zod"
import { prisma } from "@/lib/db"
import { StoreDAO, getStoreDAOBySlug } from "./store-services"

export type CategoryDAO = {
	id: string
	name: string
	createdAt: Date
	updatedAt: Date
	store: StoreDAO
	storeId: string
}

export const categorySchema = z.object({
	name: z.string().min(1, "name is required."),
	storeSlug: z.string().min(1, "storeSlug is required."),
})

export type CategoryFormValues = z.infer<typeof categorySchema>


export async function getCategorysDAO(storeSlug: string) {
  const found = await prisma.category.findMany({
    where: {
      store: {
        slug: storeSlug
      }
    },
    orderBy: {
      id: 'asc'
    },
  })
  return found as CategoryDAO[]
}

export async function getCategoryDAO(id: string) {
  const found = await prisma.category.findUnique({
    where: {
      id
    },
  })
  return found as CategoryDAO
}
    
export async function createCategory(storeId: string, name: string) {
  const created = await prisma.category.create({
    data: {
      storeId,
      name
    }
  })
  return created
}

export async function updateCategory(id: string, name: string) {
  const updated = await prisma.category.update({
    where: {
      id
    },
    data: {
      name
    }
  })
  return updated
}

export async function deleteCategory(id: string) {
  const deleted = await prisma.category.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullCategorysDAO() {
  const found = await prisma.category.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			store: true,
		}
  })
  return found as CategoryDAO[]
}
  
export async function getFullCategoryDAO(id: string) {
  const found = await prisma.category.findUnique({
    where: {
      id
    },
    include: {
			store: true,
		}
  })
  return found as CategoryDAO
}
    