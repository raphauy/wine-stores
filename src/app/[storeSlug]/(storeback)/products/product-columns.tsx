"use client"

import { Button } from "@/components/ui/button"
import { ProductDAO } from "@/services/product-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArchiveX, ArrowUpDown, CircleCheck, Pencil } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { DeleteProductDialog } from "./product-dialogs"


export const columns: ColumnDef<ProductDAO>[] = [
  

  {
    accessorKey: "image",
    header: ({ column }) => {
      return (<p></p>)
    },
    cell: ({ row }) => {
      const data = row.original;
      const firstImage = data.images[0].url;
      return (
        <div className="flex items-center justify-center">
          <Image src={firstImage} alt="product-image" width={40} height={40} />
        </div>
      );
    }
  },

  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Nombre
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data = row.original;
      let host= ""
      if (typeof window !== 'undefined') {
        host= window.location.host
      }
      const serverUrls= process.env.NEXT_PUBLIC_SERVER_HOSTs!.split(",")
      const isServer= serverUrls.some((serverUrl) => host ===serverUrl)
    
      return (
        <Link href={`${isServer ? `/${data.store.slug}/products/${data.id}` : `/products/${data.id}`}`}>
          <Button variant="link">
            {data.name}
          </Button>
        </Link>
      );
    }


  },

  {
    accessorKey: "price",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white flex justify-end w-full"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Precio
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <div className="text-right mr-5">
          {
            data.discountPrice ?
            <>
              <p className="line-through text-red-400">{data.price.toLocaleString("es-UY", {style: "currency",currency: "UYU",})}</p>
              <p>{data.discountPrice.toLocaleString("es-UY", {style: "currency",currency: "UYU",})}</p>
            </>            
            :
            <p>{data.price.toLocaleString("es-UY", {style: "currency",currency: "UYU",})}</p>
          }
          
        </div>
      )
    },
  },

  {
    accessorKey: "isFeatured",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Destacado
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <div className="ml-8">

          {
            data.isFeatured ?
            <CircleCheck className="text-green-500" />
            :
            <p className="ml-1">no</p>
          }          
        </div>
      )
    },
  },

  {
    accessorKey: "isArchived",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Archivado
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <div className="ml-8">

          {
            data.isArchived ?
            <ArchiveX />
            :
            <p className="ml-1">no</p>
          }          
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original
      const deleteDescription= `Do you want to delete Product ${data.id}?`

      let host= ""
      if (typeof window !== 'undefined') {
        host= window.location.host
      }
      const serverUrls= process.env.NEXT_PUBLIC_SERVER_HOSTs!.split(",")
      const isServer= serverUrls.some((serverUrl) => host ===serverUrl)
    
      return (
        <div className="flex items-center justify-end gap-2">

          <Link href={`${isServer ? `/${data.store.slug}/products/${data.id}` : `/products/${data.id}`}`}>
            <Button variant="ghost">
                <Pencil />
            </Button>
          </Link>

          <DeleteProductDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


