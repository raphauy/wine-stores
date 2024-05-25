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

  return (
    <div className=''>
      {storeSlug}
    </div>
  )
}


