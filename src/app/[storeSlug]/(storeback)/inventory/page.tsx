import { getLastInventoryItemDAO } from "@/services/inventoryitem-services"
import { Loader } from "lucide-react"
import { redirect } from "next/navigation"

type Props = {
  params: {
    storeSlug: string
  }
}
export default async function InventoryItemPage({ params }: Props) {

  const lastInventory= await getLastInventoryItemDAO(params.storeSlug)
  if (lastInventory) {
    redirect(`/inventory/${lastInventory.product.id}`)
  }

  return (
    <div className="w-full">
      <Loader className="h-10 w-10 animate-spin" />
    </div>
  )
}
  
