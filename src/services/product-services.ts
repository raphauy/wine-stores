import * as z from "zod"
import { prisma } from "@/lib/db"
import { StoreDAO } from "./store-services"
import { CategoryDAO } from "./category-services"
import { ImageDAO } from "./image-services"

export type ProductDAO = {
	id: string
	name: string
  description?: string
	price: number
	isFeatured: boolean
	isArchived: boolean
	createdAt: Date
	updatedAt: Date
	storeId: string
	store: StoreDAO
	categoryId: string
	category: CategoryDAO
  images: ImageDAO[]
}

export const productSchema = z.object({
	name: z.string().min(1, "nombre es obligatorio."),
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  images: z.object({ url: z.string() }).array(),
  isFeatured: z.boolean(),
  isArchived: z.boolean(),	
	categoryId: z.string().min(1, "categoría es obligatorio."),
})

export type ProductFormValues = z.infer<typeof productSchema>


export async function getProductsDAO() {
  const found = await prisma.product.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as ProductDAO[]
}

export async function getProductDAO(id: string) {
  const found = await prisma.product.findUnique({
    where: {
      id
    },
    include: {
      images: true
    }
  })
  return found as ProductDAO
}
    
export async function createProduct(storeId: string, data: ProductFormValues) {
  if (data.images.length === 0) {
    throw new Error("el producto debe tener al menos una imágen.")
  }

  const price= data.price ? Number(data.price) : 0

  // create the product and connect with all images
  const created= await prisma.product.create({
    data: {
      name: data.name,
      price,
      isFeatured: data.isFeatured,
      isArchived: data.isArchived,
      categoryId: data.categoryId,
      storeId,
      images: {
        createMany: {
          data: [
            ...data.images.map((image: { url: string }) => image),
          ],
        },
      },
    },
  })

  return created
}

export async function updateProduct(id: string, data: ProductFormValues) {
  const price= data.price ? Number(data.price) : 0

  await prisma.product.update({
    where: {
      id
    },
    data: {
      name: data.name,
      price,
      isFeatured: data.isFeatured,
      isArchived: data.isArchived,
      categoryId: data.categoryId,
      images: {
        deleteMany: {},
      },
    },
  });

  const updated= await prisma.product.update({
    where: {
      id
    },
    data: {
      images: {
        createMany: {
          data: [
            ...data.images.map((image: { url: string }) => image),
          ],
        },
      },
    },
  })

  return updated
}

export async function deleteProduct(id: string) {
  const deleted = await prisma.product.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullProductsDAO(storeSlug: string) {
  const found = await prisma.product.findMany({
    where: {
      store: {
        slug: storeSlug
      }
    },
    orderBy: {
      id: 'asc'
    },
    include: {
			store: true,
			category: true,
      images: true
		}
  })
  return found as ProductDAO[]
}

export async function getMostPopularProducts(storeSlug: string) {
  
  const found = await prisma.product.findMany({
    where: { 
      store: {
        slug: storeSlug
      },
      isArchived: false 
    },
    orderBy: { orderItems: { _count: "desc" } },
    take: 6,
    include: {
			store: true,
			category: true,
      images: true
		}
  })
  return found as ProductDAO[]
}

export async function getFeaturedProducts(storeSlug: string) {
  const found = await prisma.product.findMany({
    where: { 
      store: {
        slug: storeSlug
      },
      isFeatured: true,
      isArchived: false
    },
    orderBy: { orderItems: { _count: "desc" } },
    take: 6,
    include: {
			store: true,
			category: true,
      images: true
		}
  })
  return found as ProductDAO[]
}

export async function getNewestProducts(storeSlug: string) {
  const found = await prisma.product.findMany({
    where: { 
      store: {
        slug: storeSlug
      },
      isArchived: false
    },
    orderBy: { 
      createdAt: "desc"
    },
    take: 6,
    include: {
			store: true,
			category: true,
      images: true
		}
  })
  return found as ProductDAO[]
}

  
export async function getFullProductDAO(id: string) {
  const found = await prisma.product.findUnique({
    where: {
      id
    },
    include: {
			store: true,
			category: true,
		}
  })
  return found as ProductDAO
}
    