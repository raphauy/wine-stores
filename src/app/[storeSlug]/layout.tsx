import { redirect } from "next/navigation";
import { getCurrentRole, getCurrentUser } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import Logo from "@/components/header/logo";
import Selectors from "@/components/header/selectors/selectors";
import Logged from "@/components/header/logged";
import Menu from "@/components/header/menu";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface Props {
  children: React.ReactNode
  params: {
    storeSlug: string
  }
}

export default async function AdminLayout({ children, params }: Props) {

  const currentHost= headers().get("x-forwarded-host")
  const isSubdomain= currentHost !== process.env.NEXT_PUBLIC_URL?.split("//")[1]
  console.log("process.env.NEXT_PUBLIC_URL", process.env.NEXT_PUBLIC_URL)
  console.log("isSubdomain", isSubdomain)
  console.log("isSubdomain", isSubdomain)

  const session = await auth();
  return (
    <div className="flex flex-col items-center flex-grow p-1 w-full">
        {
          session &&
          <div className="px-3 sm:px-4 md:px-5 border-b border-b-gray-300 w-full">
            <div className="flex justify-between items-center">
              <Logo />
              <Selectors />
              <Logged />
            </div>
            <Menu isSubdomain={isSubdomain} />
          </div>
        }
        {children}
    </div>
  )
}
