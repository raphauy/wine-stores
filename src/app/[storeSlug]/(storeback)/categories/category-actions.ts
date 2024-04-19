"use server"
  
import { revalidatePath } from "next/cache"
import { CategoryDAO, CategoryFormValues, createCategory, updateCategory, getFullCategoryDAO, deleteCategory } from "@/services/category-services"
import { getStoreDAOBySlug } from "@/services/store-services"


export async function getCategoryDAOAction(id: string): Promise<CategoryDAO | null> {
    return getFullCategoryDAO(id)
}

export async function createOrUpdateCategoryAction(id: string | null, data: CategoryFormValues): Promise<CategoryDAO | null> {       
    let updated= null
    if (id) {      
        updated= await updateCategory(id, data.name, data.slug)
    } else {
        const store= await getStoreDAOBySlug(data.storeSlug)
        if (!store) {
          throw new Error("store not found")
        }

        updated= await createCategory(store.id, data.name, data.slug)
    }     

    revalidatePath("/[storeSlug]/categorys", "page")

    return updated as CategoryDAO
}

export async function deleteCategoryAction(id: string): Promise<CategoryDAO | null> {    
    const deleted= await deleteCategory(id)

    revalidatePath("/[storeSlug]/categorys")

    return deleted as CategoryDAO
}

