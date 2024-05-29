import { getLastInventoryItemDAO } from "@/services/inventoryitem-services"
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

  return <div className="w-full" />
}
  
