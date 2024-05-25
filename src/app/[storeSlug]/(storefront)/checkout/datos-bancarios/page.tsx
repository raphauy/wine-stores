import { getStoreDAOBySlug } from "@/services/store-services"

type Props= {
  params: {
    storeSlug: string
  }
}

export default async function DatosBancariosPage({ params }: Props) {

  const storeSlug = params.storeSlug

  const store= await getStoreDAOBySlug(storeSlug)
  if (!store) return <div>Store no encontrado</div>
  const banks= store.bankData

  return (
    <div className='w-full p-10'>
      <div className="container bg-white dark:bg-black p-10 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <h2 className='text-2xl font-bold'>Datos bancarios:</h2>

        {banks && banks.map((bank) => (
          <div key={bank.id} className='flex flex-col gap-2 mt-10 border-b'>
            <div className='text-lg font-bold'>{bank.name}</div>
            <div className='text-sm text-muted-foreground whitespace-pre-line'>{bank.info}</div>
          </div>
        ))}
      </div>
    </div>
  )
}


