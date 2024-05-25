"use client"

import { Button } from "@/components/ui/button"
import { BankDataDAO } from "@/services/bankdata-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteBankDataDialog, BankDataDialog } from "./bankdata-dialogs"


export const columns: ColumnDef<BankDataDAO>[] = [
  
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Banco
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "info",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Info
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original

      return (
        <p className="whitespace-pre-line">{data.info}</p>

      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete BankData ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <BankDataDialog id={data.id} storeId={data.storeId} />
          <DeleteBankDataDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


