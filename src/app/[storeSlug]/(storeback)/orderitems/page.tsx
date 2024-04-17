import { getOrderItemsDAO } from "@/services/orderitem-services"
import { OrderItemDialog } from "./orderitem-dialogs"
import { DataTable } from "./orderitem-table"
import { columns } from "./orderitem-columns"

export default async function OrderItemsPage() {
  
  const data= await getOrderItemsDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <OrderItemDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="OrderItem"/>      
      </div>
    </div>
  )
}
  
