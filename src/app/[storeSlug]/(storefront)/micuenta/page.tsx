import { auth } from "@/lib/auth"
import { getFullOrdersDAOByEmail } from "@/services/order-services"
import { getStoreDAOBySlug } from "@/services/store-services"
import { redirect } from "next/navigation"
import { columns } from "./order-columns"
import { DataTable } from "./order-table"

type Props = {
  params: {
    storeSlug: string
  }
  searchParams: {
    email: string
    storeId: string
  }
}
export default async function MiCuentaPage({ params, searchParams }: Props) {
    const storeSlug = params.storeSlug
    const store= await getStoreDAOBySlug(storeSlug)

    const session = await auth()
    const user= session?.user

    if (!session || !store || !user || !user.email) {
      if (searchParams.email && searchParams.storeId) {
        const params= `?email=${searchParams.email}&storeId=${searchParams.storeId}`
        return redirect(`/auth/login${params}`)
      }
      return redirect(`/auth/login?storeId=${store.id}`)
    }

    const data= await getFullOrdersDAOByEmail(user.email, storeSlug)

    const email= searchParams.email
    let emailMessage
    if (email && user.email !== email) {
      emailMessage= `Estas logueado con el email ${user.email} pero la orden que has creado es para ${email}. Ten encuenta que para ver las ordenes del email ${email} debes loguearte con ese email.`
    }
  
    return (
      <div className="w-full">      
        <h1 className="text-3xl text-center font-bold mt-10">Mis compras</h1>
  
        { emailMessage &&
          <div className="container bg-white p-3 mt-8 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
            <p className="text-red-500 mb-4">{emailMessage}</p>
          </div>
        }

        <div className="container bg-white p-3 mt-8 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
          <DataTable columns={columns} data={data} subject="Order"/>       
        </div>
      </div>
    )
  }
    
  