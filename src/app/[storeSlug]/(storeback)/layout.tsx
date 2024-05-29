import { Toaster } from "@/components/ui/toaster";
import { constructMetadata, getCurrentRole, getCurrentUser, htmlToText } from "@/lib/utils";
import { getStoreDAOBySlug } from "@/services/store-services";
import { redirect } from "next/navigation";

//export const metadata = constructMetadata()

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

  // const store= await getStoreDAOBySlug(params.storeSlug)
  // metadata.title= `${store?.name || 'Tienda'}`
  // metadata.description= htmlToText(store?.description || '')

  const currentRole= await getCurrentRole()
  if (currentRole?.startsWith("STORE")) {
    const storeSlug= params.storeSlug
    
    if (currentUser?.storeSlug!==storeSlug) {
      return redirect("/auth/unauthorized?message=You are not authorized to access this page")
    }

  } else if (!currentRole?.startsWith("ADMIN")) {
    return redirect("/auth/unauthorized?message=You are not authorized to access this page")
  }

  return (
    <div className="flex px-3 sm:px-4 md:px-5 flex-col items-center flex-grow p-1 w-full max-w-[1350px]">
      {children}
      <Toaster />
    </div>
  )
}
