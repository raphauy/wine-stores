"use client"

import { Button } from "@/components/ui/button"
import { OrderDAO } from "@/services/order-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CheckCircle } from "lucide-react"
import { DeleteOrderDialog } from "./order-dialogs"
import ColumnItem from "./column-item"
import { cn, completeWithZeros, formatPrice, formatWhatsAppStyle, getLabel } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import MarkAsPaidButton from "./mark-as-paid-button"


export const columns: ColumnDef<OrderDAO>[] = [
  
  {
    accessorKey: "status",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white mx-auto"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Estado
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <div className="flex flex-col gap-4 w-full items-center">
          <Badge className={cn("text-black whitespace-nowrap w-52 border border-gray-500 flex justify-center", data.status === "Paid" ? "bg-green-300" : "bg-orange-300")}>{getLabel(data.status)}</Badge>
          <div className="w-full mx-auto">
            <MarkAsPaidButton order={data} />
          </div>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: "address",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Items
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      const items= data.orderItems
      const total= items.reduce((acc, item) => acc + item.quantity * item.soldUnitPrice, 0)
      const productsCount= items.reduce((acc, item) => acc + item.quantity, 0)
      const showTotal= productsCount > 1
      return (
        <div className="">
          <Badge>Orden: {data.store.prefix}#{completeWithZeros(data.storeOrderNumber)}</Badge>
          <div className="w-full flex">
            {items.map((item) => {
              return <ColumnItem key={item.id} item={item} />
            })}
          </div>
          {
            showTotal && <p className="font-bold ml-20">Total: {formatPrice(total)}</p>
          }
        </div>
      )
    },
  },

  {
    accessorKey: "email",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Envío
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <div>
          <p>Email: {data.email}</p>
          <p>Name: {data.name}</p>
          <p>Phone: {data.phone}</p>
          <p>Address: {data.address} ({data.city})</p>
        </div>
      )
    },
  },

  {
    id: "createdAt",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Created At
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <div className="ml-2">
          <p>{formatWhatsAppStyle(data.createdAt)}</p>
        </div>
      )
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete Order ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <DeleteOrderDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


