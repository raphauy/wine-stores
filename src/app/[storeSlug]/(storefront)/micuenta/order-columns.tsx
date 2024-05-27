"use client"

import { Button } from "@/components/ui/button"
import { OrderDAO } from "@/services/order-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CheckCircle } from "lucide-react"
import { cn, formatPrice, formatWhatsAppStyle } from "@/lib/utils"
import ColumnItem from "../../(storeback)/orders/column-item"
import { OrderStatus } from "@prisma/client"
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
        <div className="flex items-center gap-2">
          <Badge className={cn("text-black whitespace-nowrap", data.status === "Paid" ? "bg-green-300" : "bg-orange-300")}>{getLabel(data.status)}</Badge>
          <div className="w-full">
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


function getLabel(status: OrderStatus) {
  switch (status) {
    case OrderStatus.Created:
      return "Creada"
    case OrderStatus.Pending:
      return "Pendiente de pago"
    case OrderStatus.PaymentSent:
      return "Pago enviado"
    case OrderStatus.Paid:
      return "Pagada"
    case OrderStatus.Delivered:
      return "Entregada"
    case OrderStatus.Packing:
      return "Preparando"
    case OrderStatus.Refunded:
      return "Reembolsada"
    case OrderStatus.Cancelled:
      return "Cancelada"
    default:
      return "Sin estado"
  }
  
}