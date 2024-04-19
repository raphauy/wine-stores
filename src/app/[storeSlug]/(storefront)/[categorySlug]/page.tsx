import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProductReel from '@/components/ProductReel'
import { getCategoryDAOBySlug } from '@/services/category-services'
import { getStoreDAOBySlug } from '@/services/store-services'
import { headers } from 'next/headers'
import Image from 'next/image'
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
  const hostUrl= process.env.NEXT_PUBLIC_URL?.split('//')[1] 
  const isSubdomain= hostUrl !== host

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
