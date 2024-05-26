"use client"

import { Button } from "@/components/ui/button"
import { OrderDAO } from "@/services/order-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CheckCircle } from "lucide-react"
import { DeleteOrderDialog } from "./order-dialogs"
import ColumnItem from "./column-item"
import { formatPrice, formatWhatsAppStyle } from "@/lib/utils"


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
        <div className="ml-2">
          {
            data.status === "Paid" ?
            <CheckCircle className="w-4 h-4 text-green-500" />
            : 
            <p>{data.status}</p>
          }
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
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


