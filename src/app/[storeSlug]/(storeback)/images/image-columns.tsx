"use client"

import { Button } from "@/components/ui/button"
import { ImageDAO } from "@/services/image-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteImageDialog, ImageDialog } from "./image-dialogs"


export const columns: ColumnDef<ImageDAO>[] = [
  
  {
    accessorKey: "url",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Url
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
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

      const deleteDescription= `Do you want to delete Image ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <ImageDialog id={data.id} />
          <DeleteImageDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


