"use server"
  
import { revalidatePath } from "next/cache"
import { StoreDAO, StoreFormValues, createStore, updateStore, getFullStoreDAO, deleteStore, setOwner, GeneralConfigFormValues, EmailConfigFormValues, updateConfigs, getStoreDAO } from "@/services/store-services"
import { getIgProfile } from "@/services/instagram-services"
import { generateSlug } from "@/lib/utils"
import { uploadFileWithUrl } from "@/services/upload-file-service"
import { sendEmailConfirmation } from "@/services/email-services"


export async function getStoreDAOAction(id: string): Promise<StoreDAO | null> {
    return getFullStoreDAO(id)
}

export async function createOrUpdateStoreAction(id: string | null, data: StoreFormValues): Promise<StoreDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateStore(id, data)
    } else {
        updated= await createStore(data)
    }     

    revalidatePath("/admin/stores")

    return updated as StoreDAO
}

export async function updateConfigsAction(id: string, data: GeneralConfigFormValues | EmailConfigFormValues): Promise<StoreDAO | null> {
    const updated= await updateConfigs(id, data)

    revalidatePath("[storeSlug]/config", "page")

    return updated as StoreDAO
}

export async function createStoreWithIgHandleAction(igHandle: string): Promise<StoreDAO | null> {    
    const igProfile= await getIgProfile(igHandle)
    if (!igProfile) {
      throw new Error("No se pudo encontrar el perfil de Instagram")
    }

    const picUrl= igProfile.profile_pic_url
    const uploadRes= await uploadFileWithUrl(picUrl)
    const image= uploadRes?.url
    const bytes= uploadRes?.bytes
    console.log("Uploaded image, bytes:", bytes);
  
    const slug= generateSlug(igProfile.full_name)
    const data= {
      name: igProfile.full_name,
      slug,
      image,
      igHandle,
      description: igProfile.biography,
      mpMarketplaceFee: "10",
    }

    const created= await createStore(data)
  
    revalidatePath("/admin/agencies")

    return created as StoreDAO
}

export async function deleteStoreAction(id: string): Promise<StoreDAO | null> {    
    const deleted= await deleteStore(id)

    revalidatePath("/admin/agencies")

    return deleted as StoreDAO
}

export async function setOwnerAction(storeId: string, userId: string): Promise<StoreDAO | null> {    
    const updated= await setOwner(storeId, userId)

    revalidatePath("/admin/agencies")

    return updated as StoreDAO
}

export async function sendConfirmationTestEmailAction(storeId: string, emailTo: string): Promise<boolean> {    
    const store= await getStoreDAO(storeId)
  
    const res= await sendEmailConfirmation(store.id, emailTo)

    revalidatePath("[storeSlug]/config", "page")

    return res
}
