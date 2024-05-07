import { getFullOauthsDAO, getOauthsDAO } from "@/services/oauth-services"
import { OauthDialog } from "./oauth-dialogs"
import { DataTable } from "./oauth-table"
import { columns } from "./oauth-columns"

export default async function OauthPage() {
  
  const data= await getFullOauthsDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <OauthDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Oauth"/>      
      </div>
    </div>
  )
}
  
