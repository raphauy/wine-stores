"use client"

import { Button } from "@/components/ui/button"
import { OrderItemDAO } from "@/services/orderitem-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteOrderItemDialog, OrderItemDialog } from "./orderitem-dialogs"


export const columns: ColumnDef<OrderItemDAO>[] = [
  
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

      const deleteDescription= `Do you want to delete OrderItem ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <OrderItemDialog id={data.id} />
          <DeleteOrderItemDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


