import { getAllCategorysDAO, getCategorysDAO } from "@/services/category-services"
import { CategoryDialog } from "./category-dialogs"
import { DataTable } from "./category-table"
import { columns } from "./category-columns"

type Props= {
  params: {
      storeSlug: string;
  }
}

export default async function CategoriesPage({ params }: Props) {
  const storeSlug = params.storeSlug
  
  const data= await getAllCategorysDAO(storeSlug)

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <CategoryDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Category"/>      
      </div>
    </div>
  )
}
  
