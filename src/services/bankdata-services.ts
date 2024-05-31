import * as z from "zod"
import { prisma } from "@/lib/db"
import { StoreDAO } from "./store-services"

export type BankDataDAO = {
	id: string
	name: string
	info: string
	createdAt: Date
	updatedAt: Date
	store: StoreDAO
	storeId: string
}

export const bankDataSchema = z.object({
	name: z.string().min(1, "name is required."),
	info: z.string().min(1, "info is required."),
	storeId: z.string().min(1, "storeId is required."),
})

export type BankDataFormValues = z.infer<typeof bankDataSchema>


export async function getBanksDatasOfStore(storeId: string) {
  const found = await prisma.bankData.findMany({
    where: {
      storeId
    },
    orderBy: {
      id: 'asc'
    },
  })
  return found as BankDataDAO[]
}

export async function getBankDataDAO(id: string) {
  const found = await prisma.bankData.findUnique({
    where: {
      id
    },
  })
  return found as BankDataDAO
}
    
export async function createBankData(data: BankDataFormValues) {
  // TODO: implement createBankData
  const created = await prisma.bankData.create({
    data
  })
  return created
}

export async function updateBankData(id: string, data: BankDataFormValues) {
  const updated = await prisma.bankData.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteBankData(id: string) {
  const deleted = await prisma.bankData.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullBankDatasDAO(storeId: string) {
  const found = await prisma.bankData.findMany({
    where: {
      storeId
    },
    orderBy: {
      name: 'asc'
    },
    include: {
			store: true,
		}
  })
  return found as BankDataDAO[]
}
  
export async function getFullBankDataDAO(id: string) {
  const found = await prisma.bankData.findUnique({
    where: {
      id
    },
    include: {
			store: true,
		}
  })
  return found as BankDataDAO
}
    