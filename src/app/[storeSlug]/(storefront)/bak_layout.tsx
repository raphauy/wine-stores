import LogoStore from "@/components/header/logo-store"
import { auth } from "@/lib/auth"
import { getStoreDAOBySlug } from "@/services/store-services"

export const dynamic = "force-dynamic"

interface Props {
  children: React.ReactNode
  params: {
    storeSlug: string
  }
}

export default async function StoreLayout({ children, params }: Props) {
  const session = await auth()

  const storeSlug = params.storeSlug
  const store= await getStoreDAOBySlug(storeSlug)

  if (!store) return <div></div>

  return (
    <div className="w-full">
      <div className="border-b border-b-gray-300 w-full dark:bg-black bg-white"> 
        <div className="flex justify-between items-center w-full">
          {!session && <LogoStore name={store.name} imageUrl={store.image} />}
        </div>
      </div>
      
      <div className="px-3 sm:px-4 md:px-5 xl:px-3 flex flex-col items-center flex-1 w-full bg-slate-50 dark:bg-black">
        {children}
      </div>

    </div>
  )
}
