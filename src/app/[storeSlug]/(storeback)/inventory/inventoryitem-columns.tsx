"use client"

import { Button } from "@/components/ui/button"
import { InventoryItemDAO } from "@/services/inventoryitem-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteInventoryItemDialog, InventoryItemDialog } from "./inventoryitem-dialogs"
import { ProductDAO } from "@/services/product-services"
import { CategoryDAO } from "@/services/category-services"
import Link from "next/link"
import Image from "next/image"


export const columns: ColumnDef<InventoryItemDAO>[] = [

  {
    accessorKey: "category",
    header: ({ column }) => {
      return null
    },
    // cell: ({ row }) => {
    filterFn: (row, id, value) => {
      const product: ProductDAO= row.getValue("product")

      return value.includes(product?.category?.name)
    },
  },

  {
    accessorKey: "product",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Producto
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      const product: ProductDAO= data.product
      const firstImage = product.images[0].url;
      let host= ""
      if (typeof window !== 'undefined') {
        host= window.location.host
      }
      const serverUrls= process.env.NEXT_PUBLIC_SERVER_HOSTs!.split(",")
      const isServer= serverUrls.some((serverUrl) => host ===serverUrl)
          return (
        <Link href={`${isServer ? `/${data.store.slug}/inventory/${product.id}` : `/inventory/${product.id}`}`}>
          <div className="flex items-center">
            <Image src={firstImage} alt="product-image" width={56} height={56} />
            <div>
              <p className="font-bold">{data.product.name}</p>
              <p>{data.product.category?.name}</p>
            </div>
          </div>
      </Link>
      )
    },
    filterFn: (row, id, value) => {
      const product: ProductDAO= row.getValue(id)
      
      return product.name.toLowerCase().includes(value.toLowerCase())
    },
  },

]


