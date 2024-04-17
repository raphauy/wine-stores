import { Button } from "@/components/ui/button"
import { getFullProductsDAO } from "@/services/product-services"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { DataTable } from "../../(storeback)/products/product-table"
import { columns } from "../../(storeback)/products/product-columns"

type Props= {
  params: {
      storeSlug: string;
  }
}

export default async function ProductosPage({ params }: Props) {
  const storeSlug = params.storeSlug
  
  const data= await getFullProductsDAO(storeSlug)

  return (
    <div className="w-full p-4">      


      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Product"/>       
      </div>
    </div>
  )
}
  
