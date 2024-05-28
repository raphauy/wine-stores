"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn, completeWithZeros, formatPrice, formatWhatsAppStyle, getLabel } from "@/lib/utils"
import { OrderDAO } from "@/services/order-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import ColumnItem from "../../(storeback)/orders/column-item"
import MarkAsPaymentSentButton from "./mark-as-payment-sent-button"


export const columns: ColumnDef<OrderDAO>[] = [
  
  {
    accessorKey: "status",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="dark:text-white flex justify-center w-full"
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
            <MarkAsPaymentSentButton order={data} />
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
        <Button variant="ghost" className="ml-1 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Productos
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
          <p>Nombre: {data.name}</p>
          <p>Dirección: {data.address}</p>          
          <p>Ciudad: {data.city}</p>
          <p>Teléfono: {data.phone}</p>
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
            Fecha
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

]


