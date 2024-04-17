"use client"

import { UserRole } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useParams, usePathname } from "next/navigation"

export function useRoles(): UserRole[] {
  const params= useParams()
  const path= usePathname()
  
  const storeSlug= params.storeSlug

  const currentRole= useSession().data?.user.role

  if (path === "/admin/users" || currentRole === "ADMIN") {
    return Object.values(UserRole)
  }

  if (storeSlug) {
    if (currentRole === "STORE_OWNER")
      return ["STORE_OWNER", "STORE_ADMIN"]

    if (currentRole === "STORE_ADMIN") 
      return ["STORE_ADMIN"]
  } 

  return []
}

export function useStoreSlug() {
  const params= useParams()
  return params.storeSlug
}

export function useAdminRoles(): UserRole[] {
  return [UserRole.ADMIN, UserRole.STORE_OWNER, UserRole.STORE_ADMIN]
}

export function useClientRoles(): UserRole[] {
  return [UserRole.ADMIN, UserRole.STORE_OWNER, UserRole.STORE_ADMIN]
}