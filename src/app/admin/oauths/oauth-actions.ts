"use server"
  
import { revalidatePath } from "next/cache"
import { OauthDAO, OauthFormValues, createOauth, updateOauth, getFullOauthDAO, deleteOauth } from "@/services/oauth-services"


export async function getOauthDAOAction(id: string): Promise<OauthDAO | null> {
    return getFullOauthDAO(id)
}

export async function createOrUpdateOauthAction(id: string | null, data: OauthFormValues): Promise<OauthDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateOauth(id, data)
    } else {
        updated= await createOauth(data)
    }     

    revalidatePath("/admin/oauths")

    return updated as OauthDAO
}

export async function deleteOauthAction(id: string): Promise<OauthDAO | null> {    
    const deleted= await deleteOauth(id)

    revalidatePath("/admin/oauths")

    return deleted as OauthDAO
}

