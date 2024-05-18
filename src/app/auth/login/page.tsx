import { getCurrentUser } from "@/lib/utils";
import { LoginForm } from "./login-form";
import { redirect } from "next/navigation";
import { getStoreDAO } from "@/services/store-services";

type Props = {
  searchParams: {
    email: string
    storeId: string
  }
}
export default async function LoginPage({ searchParams }: Props) {
  const requestEmail= searchParams.email
  const requestStoreId= searchParams.storeId

  console.log("email", requestEmail)
  console.log("store", requestStoreId)

  let storeName
  if (requestStoreId) {
    const store= await getStoreDAO(requestStoreId)
    storeName= store.name
  }

  const user= await getCurrentUser()
  console.log("xxxxxxx redirecting...");
  console.log(user)  
  if (user?.role === "CLIENT")
    redirect("/micuenta")

  if (user) redirect("/")
  return (
    <LoginForm requestedEmail={requestEmail} storeName={storeName} />
  )
}
