import { auth } from "@/lib/auth"
import { getStoreDAOBySlug } from "@/services/store-services"
import { redirect } from "next/navigation"

type Props = {
  params: {
    storeSlug: string
  }
}
export default async function MiCuentaPage({ params }: Props) {
    const storeSlug = params.storeSlug
    const store= await getStoreDAOBySlug(storeSlug)

    const session = await auth()
    const user= session?.user

    if (!session || !store || !user) {
        return redirect("/auth/login")
    }

    return (
        <div>
            <h1>Mi Cuenta en {store?.name}</h1>            
            <p>Hola {user?.name}</p>    

        </div>
    )
}
