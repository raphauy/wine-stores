"use server"
  
import { revalidatePath } from "next/cache"
import { ProductDAO, ProductFormValues, createProduct, updateProduct, getFullProductDAO, deleteProduct, slugExists } from "@/services/product-services"
import { getStoreDAOBySlug } from "@/services/store-services"
import { generateSlug } from "@/lib/utils"


export async function getProductDAOAction(id: string): Promise<ProductDAO | null> {
    return getFullProductDAO(id)
}

export async function createProductAction(storeSlug: string, categorySlug: string, data: ProductFormValues): Promise<ProductDAO | null> {        
    const store= await getStoreDAOBySlug(storeSlug) 
    if (!store) {
      throw new Error("store not found")
    }

    const exists= await slugExists(data.slug, storeSlug, categorySlug)
    if (exists) {
      throw new Error("ya existe un producto con este nombre")
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

