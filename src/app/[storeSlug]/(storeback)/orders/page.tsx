import { getFullOrdersDAO, getOrdersDAO } from "@/services/order-services"
import { DataTable } from "./order-table"
import { columns } from "./order-columns"

export const maxDuration = 59; // This function can run for a maximum of 30 seconds
export const dynamic = 'force-dynamic';

type Props= {
  params: {
    storeSlug: string
  }
}
export default async function OrdersPage({ params }: Props) {
  
  const storeSlug= params.storeSlug
  const data= await getFullOrdersDAO(storeSlug)

  return (
    <div className="w-full">      

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Order" />      
      </div>
    </div>
  )
}
  
