"use client"

import { Button } from "@/components/ui/button"
import { UserDAO } from "@/services/user-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteUserDialog, UserDialog } from "@/app/admin/users/user-dialogs"


export const columns: ColumnDef<UserDAO>[] = [
  
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "email",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Email
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "emailVerified",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            EmailVerified
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
		cell: ({ row }) => {
      const data= row.original
      const date= data.emailVerified && format(new Date(data.emailVerified), "yyyy-MM-dd")
      return (<p>{date}</p>)
    }
  },

  {
    accessorKey: "role",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Role
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Seguro que quieres eliminar el usuario ${data.name}`

      const role= data.role
      const isStoreOwner= role === "STORE_OWNER"      

      return (
        <div className="flex items-center justify-end gap-2">

          <UserDialog id={data.id} />
          {!isStoreOwner && <DeleteUserDialog description={deleteDescription} id={data.id} />}          
        </div>

      )
    },
  },
]


