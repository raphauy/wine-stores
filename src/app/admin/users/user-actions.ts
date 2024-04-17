"use server"
  
import { revalidatePath } from "next/cache"
import { UserDAO, UserFormValues, createUser, updateUser, getFullUserDAO, deleteUser, getUsersOfStore } from "@/services/user-services"


export async function getUserDAOAction(id: string): Promise<UserDAO | null> {
    return getFullUserDAO(id)
}

export async function getUsersOfStoreAction(storeId: string): Promise<UserDAO[]> {
    const res= await getUsersOfStore(storeId)

    revalidatePath("/admin/users")

    return res
}

export async function createOrUpdateUserAction(id: string | null, data: UserFormValues): Promise<UserDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateUser(id, data)
    } else {
        updated= await createUser(data)
    }     

    revalidatePath("/admin/users")

    return updated as UserDAO
}

export async function deleteUserAction(id: string): Promise<UserDAO | null> {    
    const deleted= await deleteUser(id)

    revalidatePath("/admin/users")

    return deleted as UserDAO
}

