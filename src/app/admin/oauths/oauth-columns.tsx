"use client"

import { Button } from "@/components/ui/button"
import { OauthDAO } from "@/services/oauth-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteOauthDialog, OauthDialog } from "./oauth-dialogs"


export const columns: ColumnDef<OauthDAO>[] = [

  {
    accessorKey: "store.name",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Store
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (<p>{data.store.name}</p>)
    }
  },

  {
    accessorKey: "provider",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Provider
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },


  {
    accessorKey: "expiresAt",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            ExpiresAt
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
		cell: ({ row }) => {
      const data= row.original
      const date= data.expiresAt && format(new Date(data.expiresAt), "yyyy-MM-dd")
      return (<p>{date}</p>)
    }
  },

  // {
  //   accessorKey: "role",
  //   header: ({ column }) => {
  //     return (
  //       <Button variant="ghost" className="pl-0 dark:text-white"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
  //         Rol
  //         <ArrowUpDown className="w-4 h-4 ml-1" />
  //       </Button>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete Oauth ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <OauthDialog id={data.id} />
          <DeleteOauthDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


