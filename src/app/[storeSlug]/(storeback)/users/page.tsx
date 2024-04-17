import { UserDialog } from "@/app/admin/users/user-dialogs"
import { DataTable } from "@/app/admin/users/user-table"
import { getStoreDAOBySlug } from "@/services/store-services"
import { getUsersOfStore } from "@/services/user-services"
import { columns } from "./user-columns"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type Props = {
  params: {
    storeSlug: string
  }
}
export default async function UsersPage({ params }: Props) {
  const storeSlug= params.storeSlug
  const store= await getStoreDAOBySlug(storeSlug)
  const data= await getUsersOfStore(store.id)

  return (
    <div className="w-full">      
      <div className="flex justify-end mx-auto my-2">
        <UserDialog storeId={store.id} />
      </div>

      <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white  bg-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="User" />
      </div>
    </div>
  )
}
  
