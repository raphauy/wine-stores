"use server"
  
import { revalidatePath } from "next/cache"
import { StoreDAO, StoreFormValues, createStore, updateStore, getFullStoreDAO, deleteStore, setOwner, GeneralConfigFormValues, EmailConfigFormValues, updateConfigs, getStoreDAO, getStoreDAOBySlug } from "@/services/store-services"
import { getIgProfile } from "@/services/instagram-services"
import { generateSlug } from "@/lib/utils"
import { uploadFileWithUrl } from "@/services/upload-file-service"
import { sendBankDataEmail, sendNotifyPaymentEmail, sendPaymentConfirmationEmail } from "@/services/email-services"
import { getLastOrderDAO } from "@/services/order-services"


export async function getStoreDAOAction(id: string): Promise<StoreDAO | null> {
    return getFullStoreDAO(id)
}

export async function getStoreDAOBySlugAction(slug: string): Promise<StoreDAO | null> {
    return getStoreDAOBySlug(slug)
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
      prefix: "LT",
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


export async function sendTestEmailAction(storeId: string, testEmailTo: string, type: "confirmation" | "bank-data" | "notify-payment") {
    const lastOrder= await getLastOrderDAO(storeId)
    if (!lastOrder) {
        throw new Error("No hay ordenes en el store")
    }

    let res

    if (type === "confirmation") {
        res= await sendPaymentConfirmationEmail(lastOrder.id, testEmailTo)
    } else if (type === "bank-data") {
        res= await sendBankDataEmail(lastOrder.id, testEmailTo)
    } else if (type === "notify-payment") {
        res= await sendNotifyPaymentEmail(lastOrder.id, testEmailTo)
    }

    revalidatePath("[storeSlug]/config", "page")

    return res
}