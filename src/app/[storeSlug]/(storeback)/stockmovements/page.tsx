import { getStockMovementsDAO } from "@/services/stockmovement-services" 
import { StockMovementDialog } from "./stockmovement-dialogs"
import { DataTable } from "./stockmovement-table"
import { columns } from "./stockmovement-columns"

export default async function StockMovementPage() {
  
  const data= await getStockMovementsDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <StockMovementDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="StockMovement"/>      
      </div>
    </div>
  )
}
  
