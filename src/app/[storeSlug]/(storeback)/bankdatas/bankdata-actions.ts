"use server"
  
import { revalidatePath } from "next/cache"
import { BankDataDAO, BankDataFormValues, createBankData, updateBankData, getFullBankDataDAO, deleteBankData, getBanksDatasOfStore } from "@/services/bankdata-services"


export async function getBankDataDAOAction(id: string): Promise<BankDataDAO | null> {
    return getFullBankDataDAO(id)
}

export async function createOrUpdateBankDataAction(id: string | null, data: BankDataFormValues): Promise<BankDataDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateBankData(id, data)
    } else {
        updated= await createBankData(data)
    }     

    revalidatePath("/(storeback)/bankdatas")

    return updated as BankDataDAO
}

export async function deleteBankDataAction(id: string): Promise<BankDataDAO | null> {    
    const deleted= await deleteBankData(id)

    revalidatePath("/(storeback)/bankdatas")

    return deleted as BankDataDAO
}

export async function getBanksDatasOfStoreAction(storeId: string): Promise<BankDataDAO[]> {
    return getBanksDatasOfStore(storeId)
}