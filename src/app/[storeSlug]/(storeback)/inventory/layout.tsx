import { getCurrentRole, getCurrentUser } from "@/lib/utils";
import { redirect } from "next/navigation";
import { DataTable } from "./inventoryitem-table";
import { columns } from "./inventoryitem-columns";
import { getFullInventoryItemsDAO } from "@/services/inventoryitem-services";

interface Props {
  children: React.ReactNode
  params: {
    storeSlug: string
  }
}

export default async function AdminLayout({ children, params }: Props) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return redirect("/auth/login")
  }

  const storeSlug= params.storeSlug

  const currentRole= await getCurrentRole()
  if (currentRole?.startsWith("STORE")) {    
    if (currentUser?.storeSlug!==storeSlug) {
      return redirect("/auth/unauthorized?message=You are not authorized to access this page")
    }
  } else if (!currentRole?.startsWith("ADMIN")) {
    return redirect("/auth/unauthorized?message=You are not authorized to access this page")
  }

  const data= await getFullInventoryItemsDAO(storeSlug)
  const categories = data.map((item) => item.product.category.name)
  const categoryNamesSet = new Set(categories)
  const categoryNamesList = Array.from(categoryNamesSet)  

  return (
    <div className="flex w-full gap-2 mt-3 h-full">
      <div className="bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="InventoryItem" categories={categoryNamesList} columnsOff={["category"]} /> 
      </div>
      {children}
    </div>
  )
}
