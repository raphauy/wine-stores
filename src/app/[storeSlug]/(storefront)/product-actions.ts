"use server"
  
import { revalidatePath } from "next/cache"
import { ProductDAO, ProductFormValues, createProduct, updateProduct, getFullProductDAO, deleteProduct, getInfiniteProducts } from "@/services/product-services"
import { getStoreDAOBySlug } from "@/services/store-services"
import { TQueryValidator } from "@/components/query-validator"


export async function getProductDAOAction(id: string): Promise<ProductDAO | null> {
    return getFullProductDAO(id)
}

export async function createProductAction(storeSlug: string, data: ProductFormValues): Promise<ProductDAO | null> {        
    const store= await getStoreDAOBySlug(storeSlug) 
    if (!store) {
      throw new Error("store not found")
    }

    const updated= await createProduct(store.id, data)

    revalidatePath("/[storeSlug]/products", "page")

    return updated as ProductDAO
}

export async function updateProductAction(id: string, data: ProductFormValues): Promise<ProductDAO | null> {       
    const updated= await updateProduct(id, data)

    revalidatePath("/[storeSlug]/products", "page")

    return updated as ProductDAO
}

export async function deleteProductAction(id: string): Promise<ProductDAO | null> {    
    const deleted= await deleteProduct(id)

    revalidatePath("/[storeSlug]/products", "page")

    return deleted as ProductDAO
}

export async function getInfiniteProductsAction(storeSlug: string, query: TQueryValidator): Promise<ProductDAO[]> {
    const store= await getStoreDAOBySlug(storeSlug) 
    if (!store) {
      throw new Error("store not found")
    }

    const products= await getInfiniteProducts(store.id, query)

    return products as ProductDAO[]
}