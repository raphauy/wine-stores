import * as z from "zod"
import { prisma } from "@/lib/db"
import { StoreDAO } from "./store-services"
import { CategoryDAO } from "./category-services"
import { ImageDAO } from "./image-services"
import { QueryValidator, TQueryValidator } from "@/components/query-validator"
import { InventoryItemFormValues, createInventoryItem, getInventoryItemDAOByProductId } from "./inventoryitem-services"
import { MovementType } from "@prisma/client"
import { StockMovementFormValues, createStockMovement } from "./stockmovement-services"

export type ProductDAO = {
	id: string
	name: string
  slug: string
  description?: string
  deliveryInfo?: string
	price: number
  discountPrice: number | undefined
	isFeatured: boolean
	isArchived: boolean
	createdAt: Date
	updatedAt: Date
	storeId: string
	store: StoreDAO
	categoryId: string
	category: CategoryDAO
  images: ImageDAO[]
  inventoryItemId: string
}

export const productSchema = z.object({
	name: z.string().min(1, "nombre es obligatorio."),
  slug: z.string().min(1, "slug es obligatorio."),
  description: z.string().optional(),
  deliveryInfo: z.string().optional(),
  price: z.string()
    .refine((val) => !isNaN(Number(val)), { message: "debe ser un número" })
    .refine((val) => Number(val) > 0, { message: "el precio debe ser mayor que cero" }),  
  discountPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  images: z.object({ url: z.string() }).array(),
  isFeatured: z.boolean(),
  isArchived: z.boolean(),	
	categoryId: z.string().min(1, "categoría es obligatorio."),
  initialQuantity: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
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
      images: true,
      category: true,
    }
  })
  return found as ProductDAO
}

export async function getProductDAOBySlug(storeSlug: string, categorySlug: string, productSlug: string) {
  const found = await prisma.product.findFirst({
    where: {
      slug: productSlug,
      store: {
        slug: storeSlug
      },
      category: {
        slug: categorySlug
      }
    },
    include: {
      images: true,
      category: true,
    }
  })
  return found as ProductDAO
}
    
export async function createProduct(storeId: string, data: ProductFormValues) {
  if (data.images.length === 0) {
    throw new Error("el producto debe tener al menos una imágen.")
  }

  const price= data.price ? Number(data.price) : 0
  const discountPrice= data.discountPrice ? Number(data.discountPrice) : 0

  // create the product and connect with all images
  const created= await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      deliveryInfo: data.deliveryInfo,
      slug: data.slug,
      price,
      discountPrice,
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

  const inventoryForm: InventoryItemFormValues = {
    storeId,
    productId: created.id,
    quantity: data.initialQuantity,
  }
  const inventoryCreated = await createInventoryItem(inventoryForm)
  const stockMovementForm: StockMovementFormValues = {
    inventoryItemId: inventoryCreated.id,
    type: MovementType.ENTRADA,
    quantity: data.initialQuantity,
    comment: "Cantidad inicial",
  }
  await createStockMovement(stockMovementForm)

  return created
}

export async function updateProduct(id: string, data: ProductFormValues) {
  const price= data.price ? Number(data.price) : 0
  const discountPrice= data.discountPrice ? Number(data.discountPrice) : 0

  await prisma.product.update({
    where: {
      id
    },
    data: {
      name: data.name,
      description: data.description,
      deliveryInfo: data.deliveryInfo,
      slug: data.slug,
      price,
      discountPrice,
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

  const inventoryItem= await getInventoryItemDAOByProductId(id)

  if (inventoryItem === null) {
    const inventoryForm: InventoryItemFormValues = {
      storeId: updated.storeId,
      productId: id,
      quantity: data.initialQuantity,
    }
    console.log("inventoryForm", inventoryForm)
    
    const inventoryCreated = await createInventoryItem(inventoryForm)
    const stockMovementForm: StockMovementFormValues = {
      inventoryItemId: inventoryCreated.id,
      type: MovementType.ENTRADA,
      quantity: data.initialQuantity,
      comment: "Cantidad inicial",
    }
    await createStockMovement(stockMovementForm)  
  }

  return updated
}

export async function deleteProduct(id: string) {
  const inventoryItem= await getInventoryItemDAOByProductId(id)
  const stockMovments= inventoryItem.stockMovements
  if (stockMovments.length > 0) {
    throw new Error("No se puede borrar un producto que tiene stock.")
  } else {
    // disconnect the inventory item from the product
    await prisma.inventoryItem.delete({
      where: {
        id: inventoryItem.id
      }
    })
  }
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

export async function getInfiniteProducts(storeId: string, query: TQueryValidator) {
  
  const categoryId= query.category
  const sort= query.sort
  const limit= query.limit

  const where= categoryId ? { 
    storeId,
    isArchived: false,
    categoryId 
  } 
  : 
  {
    storeId,
    isArchived: false,
  }

  const found = await prisma.product.findMany({
    where,
    orderBy: {
      name: sort,
    },
    take: limit,
    include: {
			store: true,
			category: true,
      images: true
		}
  })

  return found as ProductDAO[]
}

export async function slugExists(slug: string, storeSlug: string, categorySlug: string) {
  const found = await prisma.product.findFirst({
    where: {
      slug,
      store: {
        slug: storeSlug
      },
      category: {
        slug: categorySlug
      }
    },
  })
  return found !== null
}