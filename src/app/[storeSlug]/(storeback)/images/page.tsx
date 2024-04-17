import { getImagesDAO } from "@/services/image-services"
import { ImageDialog } from "./image-dialogs"
import { DataTable } from "./image-table"
import { columns } from "./image-columns"

type Params = {
  params: {
    storeSlug: string
  }
}
export default async function ImagesPage({ params }: Params) {
  
  const storeSlug = params.storeSlug

  const data= await getImagesDAO(storeSlug)

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <ImageDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Image"/>      
      </div>
    </div>
  )
}
  
