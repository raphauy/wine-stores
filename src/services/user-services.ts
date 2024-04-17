import * as z from "zod"
import { prisma } from "@/lib/db"
import { UserRole } from "@prisma/client"

export type UserDAO = {
	id: string
	name: string | undefined
	email: string
	emailVerified: Date | undefined
	image: string | undefined
	role: UserRole
  storeId: string | undefined
  storeName: string | undefined
	createdAt: Date
	updatedAt: Date
}

export const userSchema = z.object({
	name: z.string().optional(),
	email: z.string({required_error: "email is required."}),
  role: z.nativeEnum(UserRole),
	image: z.string().optional(),
  storeId: z.string().optional(),
})

export type UserFormValues = z.infer<typeof userSchema>


export async function getUsersDAO() {
  const found = await prisma.user.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as UserDAO[]
}

export async function getUserDAO(id: string) {
  const found = await prisma.user.findUnique({
    where: {
      id
    },
  })
  return found as UserDAO
}
    
export async function createUser(data: UserFormValues) {
  const created = await prisma.user.create({
    data
  })
  return created
}

export async function updateUser(id: string, data: UserFormValues) {
  const updated = await prisma.user.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteUser(id: string) {
  const deleted = await prisma.user.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullUsersDAO() {
  const found = await prisma.user.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
      store: true,
		}
  })

  const res= found.map((user) => {
    return {
      ...user,
      storeName: user.store?.name
    }
  })

  return res as UserDAO[]
}
  
export async function getFullUserDAO(id: string) {
  const found = await prisma.user.findUnique({
    where: {
      id
    },
    include: {
      store: true,
    }
  })
  const res= {
    ...found,
    storeName: found?.store?.name
  }
  return res as UserDAO
}


export async function getUsersOfStore(storeId: string) {
  const found = await prisma.user.findMany({
    where: {
      storeId,
      role: {
        in: ["STORE_OWNER", "STORE_ADMIN"]
      }
    },
    orderBy: {
      id: 'asc'
    },
    include: {
      store: true
    }
  })

  const res= found.map((user) => {
    return {
      ...user,
      storeName: user.store?.name
    }
  })

  return res as UserDAO[]
}

export async function getFullUsersOfStore(storeId: string) {
  const found = await prisma.user.findMany({
    where: {
      storeId
    },
    orderBy: {
      id: 'asc'
    },
    include: {
      store: true,
    }
  })

  const res= found.map((user) => {
    return {
      ...user,
      storeName: user.store?.name
    }
  })

  return res as UserDAO[]
}

