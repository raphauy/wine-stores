import { getStoresDAO } from "@/services/store-services";
import StoreSelector from "./store-selector";
import { getCurrentRole } from "@/lib/utils";

export type SelectorData={
  slug: string,
  name: string,
  image?: string
}

export type ChannelSelectorData={
  slug: string,
  name: string,
  icon: string
}

export default async function Selectors() {
  const currentRole= await getCurrentRole()

  const stores= await getStoresDAO()
  const storeSelectors: SelectorData[]= stores.map(store => ({slug: store.slug, name: store.name, image: store.image}))
  
  return (
    <div className="w-full flex items-center px-2 mt-1">
        <StoreSelector selectors={storeSelectors} />        
    </div>
  )
}
