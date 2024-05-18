import { redirect } from "next/navigation";
import { getAdminRoles, getCurrentRole, getCurrentUser } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import Logo from "@/components/header/logo";
import Selectors from "@/components/header/selectors/selectors";
import Logged from "@/components/header/logged";
import Menu from "@/components/header/menu";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserRole } from "@prisma/client";

interface Props {
  children: React.ReactNode
  params: {
    storeSlug: string
  }
}

export default async function AdminLayout({ children, params }: Props) {

  const currentHost= headers().get("x-forwarded-host")
  const isSubdomain= currentHost !== process.env.NEXT_PUBLIC_URL?.split("//")[1]

  const session = await auth();
  const currentRole: UserRole| undefined = session?.user?.role as UserRole | undefined
  const isAdmin= currentRole === UserRole.ADMIN || currentRole === UserRole.STORE_OWNER || currentRole === UserRole.STORE_ADMIN

  const pathName= headers().get("next-url")
  console.log("pathName", pathName)  
  console.log("currentHost", currentHost)  
  console.log("currentRole", currentRole)  
  console.log("isAdmin", isAdmin)
  
  if (!isAdmin && pathName?.endsWith("/oauth/mp-callback")) {
    // public url only for MP
    return children
  }

  if (!isAdmin && pathName?.includes("/oauth")) {
    // private url
    console.log("someone is trying to access a page that is not admin and not the MP oauth callback")    
    return <div className="mt-10 text-lg">You are not authorized to access this page</div>
  }

  if (!isAdmin) {
    // public url
    return children
  }

  return (
    <div className="flex flex-col items-center flex-grow p-1 w-full">
        {
          session &&
          <div className="px-3 sm:px-4 md:px-5 border-b border-b-gray-300 w-full">
            <div className="flex justify-between items-center">
              <Logo />
              <Selectors />
              <Logged isSubdomain={isSubdomain} />
            </div>
            <Menu isSubdomain={isSubdomain} />
          </div>
        }
        {children}
    </div>
  )
}
