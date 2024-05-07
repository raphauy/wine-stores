import { Button } from "@/components/ui/button"
import { getFullProductsDAO } from "@/services/product-services"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { columns } from "./product-columns"
import { DataTable } from "./product-table"

type Props= {
  params: {
      storeSlug: string;
  }
}

export default async function ProductsPage({ params }: Props) {
  const storeSlug = params.storeSlug
  
  const data= await getFullProductsDAO(storeSlug)

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <Link href={`/products/new`} >
          <Button className="gap-2">
            <PlusCircle className="h-5 w-5" /> Crear Producto
          </Button>
        </Link>
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Product"/>      
      </div>
    </div>
  )
}
  
