import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProductReel from '@/components/ProductReel'
import { constructMetadata } from '@/lib/utils'
import { getCategoryDAOBySlug } from '@/services/category-services'
import { getStoreDAOBySlug } from '@/services/store-services'
import { Metadata } from 'next'
import { headers } from 'next/headers'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const storeSlug = params.storeSlug
  const store = await getStoreDAOBySlug(storeSlug)
  const categorySlug = params.categorySlug
  const category = await getCategoryDAOBySlug(storeSlug, categorySlug)
 
  return {
    title: category?.name + ' - ' + store?.name,
    description: store?.description,
    openGraph: {
      title: store?.name,
      description: store?.description,
      url: `${store?.mpRedirectUrl}`,
      images: [
        {
          url: `${store?.image}`,
          width: 661,
          height: 661,
          alt: store?.name,
        },
      ],
    },
    metadataBase: new URL(store?.mpRedirectUrl || process.env.NEXT_PUBLIC_URL!),
  }
}

type Props= {
  params: {
    storeSlug: string
    categorySlug: string
  }
}
export default async function StoreFrontHome({ params }: Props) {
  const storeSlug = params.storeSlug
  const categorySlug = params.categorySlug
  if (!storeSlug) {
    return <div>No se ha encontrado el Store</div>
  }

  const category= await getCategoryDAOBySlug(storeSlug, categorySlug)
  if (!category) {
    return <div></div>
  }

  const host= headers().get('host')
  // const hostUrl= process.env.NEXT_PUBLIC_URL?.split('//')[1] 
  // const isSubdomain= hostUrl !== host
  const serverUrls= process.env.NEXT_PUBLIC_SERVER_HOSTs!.split(",")
  const isServer= serverUrls.some((serverUrl) => host ===serverUrl)
  const isSubdomain= !isServer

  return (
    <>
      <MaxWidthWrapper>
        <ProductReel
          key={category.id}
          query={{ sort: 'asc', category: category.id }}
          title={category.name}
          isSubdomain={isSubdomain}
        />
      </MaxWidthWrapper>


      {/* <section className='border-t border-gray-200 bg-gray-50'>
      <ProductReel
        query={{ sort: 'desc' }}
        href='/productos?sort=recent'
        title='Brand new'
      />
      </section> */}
    </>
  )
}
