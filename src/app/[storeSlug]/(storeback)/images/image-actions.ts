"use server"
  
import { revalidatePath } from "next/cache"
import { ImageDAO, ImageFormValues, createImage, updateImage, getFullImageDAO, deleteImage } from "@/services/image-services"


export async function getImageDAOAction(id: string): Promise<ImageDAO | null> {
    return getFullImageDAO(id)
}

export async function createOrUpdateImageAction(id: string | null, data: ImageFormValues): Promise<ImageDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateImage(id, data)
    } else {
        updated= await createImage(data)
    }     

    revalidatePath("/[storeSlug]/images")

    return updated as ImageDAO
}

export async function deleteImageAction(id: string): Promise<ImageDAO | null> {    
    const deleted= await deleteImage(id)

    revalidatePath("/[storeSlug]/images")

    return deleted as ImageDAO
}

