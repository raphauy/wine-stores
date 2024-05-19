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
      const host= window.location.host
      const hostUrl= process.env.NEXT_PUBLIC_URL?.split('//')[1] 
      const isSubdomain= hostUrl !== host
      const slug= data.store.slug
      return (
        <Link href={`${isSubdomain ? `/products/${data.id}` : `/${slug}/products/${data.id}`}`} >
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
          <p>{data.price.toLocaleString("es-UY", {style: "currency",currency: "UYU",})}</p>
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
      const host= window.location.host
      const hostUrl= process.env.NEXT_PUBLIC_URL?.split('//')[1] 
      const isSubdomain= hostUrl !== host
      const slug= data.store.slug
 
      return (
        <div className="flex items-center justify-end gap-2">

          <Link href={`${isSubdomain ? `/products/${data.id}` : `/${slug}/products/${data.id}`}`} >
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


