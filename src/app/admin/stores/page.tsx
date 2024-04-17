import { getFullStoresDAO } from "@/services/store-services"
import { columns } from "./store-columns"
import { StoreDialog } from "./store-dialogs"
import { DataTable } from "./store-table"

export default async function UsersPage() {
  
  const data= await getFullStoresDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2 gap-2">
        <StoreDialog />
        <StoreDialog igForm={true} />
      </div>

      <div className="container bg-white dark:bg-black p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Store" columnsOff={["slug"]} />
      </div>
    </div>
  )
}
  
