"use server"
  
import { Availability, updateAvailabilities } from "@/services/calcom-sdk"
import { revalidatePath } from "next/cache"

export async function updateAvailabilitiesAction(scheduleId: number, availabilities: Availability[]): Promise<boolean> {       
    const updated= await updateAvailabilities(scheduleId, availabilities)

    revalidatePath("/[storeSlug]/experiences", "page")

    return updated as boolean
}