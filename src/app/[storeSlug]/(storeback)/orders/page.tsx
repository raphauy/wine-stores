import { getOrdersDAO } from "@/services/order-services"
import { OrderDialog } from "./order-dialogs"
import { DataTable } from "./order-table"
import { columns } from "./order-columns"

export default async function OrdersPage() {
  
  const data= await getOrdersDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <OrderDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Order"/>      
      </div>
    </div>
  )
}
  
