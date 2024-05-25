import { getFullBankDatasDAO } from "@/services/bankdata-services"
import { BankDataDialog } from "./bankdata-dialogs"
import { DataTable } from "./bankdata-table"
import { columns } from "./bankdata-columns"
import { getStoreDAOBySlug } from "@/services/store-services"

type Props= {
  params: {
    storeSlug: string
  }
}

export default async function BankDataPage({ params }: Props) {
  
  const storeSlug= params.storeSlug
  const store= await getStoreDAOBySlug(storeSlug)
  if (!store)
    return <div>Store not found</div>
  
  const data= await getFullBankDatasDAO(store.id)

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <BankDataDialog storeId={store.id} />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="BankData" storeId={store.id}/>
      </div>
    </div>
  )
}
  
