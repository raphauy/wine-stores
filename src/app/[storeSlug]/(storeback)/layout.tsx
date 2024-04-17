import { redirect } from "next/navigation";
import { getCurrentRole, getCurrentUser } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import Logo from "@/components/header/logo";
import Selectors from "@/components/header/selectors/selectors";
import Logged from "@/components/header/logged";
import Menu from "@/components/header/menu";
import { auth } from "@/lib/auth";

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

  const currentRole= await getCurrentRole()
  if (currentRole?.startsWith("STORE")) {
    const storeSlug= params.storeSlug
    
    if (currentUser?.storeSlug!==storeSlug) {
      return redirect("/auth/unauthorized?message=You are not authorized to access this page ss")
    }

  } else if (!currentRole?.startsWith("ADMIN")) {
    return redirect("/auth/unauthorized?message=You are not authorized to access this page dd")
  }

  return (
    <div className="flex px-3 sm:px-4 md:px-5 flex-col items-center flex-grow p-1 w-full max-w-[1350px]">
      {children}
    </div>
  )
}
