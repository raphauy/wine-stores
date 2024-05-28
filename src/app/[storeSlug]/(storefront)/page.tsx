import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button, buttonVariants } from '@/components/ui/button'
import { getStoreDAOBySlug } from '@/services/store-services'
import { ArrowDownToLine, CheckCircle, Leaf, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ProductGridSection } from './bak_page'
import { getFeaturedProducts } from '@/services/product-services'
import ProductReel from '@/components/ProductReel'
import { headers } from 'next/headers'
import { extractEmail } from '@/lib/utils'
type Props= {
  params: {
    storeSlug: string
  }
}
export default async function StoreFrontHome({ params }: Props) {
  const storeSlug = params.storeSlug  
  if (!storeSlug) {
    return <div>No se ha encontrado el Store</div>
  }

  const host= headers().get('host')
  // const hostUrl= process.env.NEXT_PUBLIC_URL?.split('//')[1] 
  // const isSubdomain= hostUrl !== host
  const serverUrls= process.env.NEXT_PUBLIC_SERVER_HOSTs!.split(",")
  const isServer= serverUrls.some((serverUrl) => host ===serverUrl)
  const isSubdomain= !isServer

  const store= await getStoreDAOBySlug(storeSlug)


  if (!store || !store.image) {
    return <div>No se ha encontrado el Store</div>
  }
  const categories= store.categories

  return (
    <>
      <MaxWidthWrapper>
        <div className='pt-8 pb-10 mx-auto text-center flex flex-col items-center max-w-3xl'>
          { store.image && <Image src={store.image} alt={store.name} width={60} height={60} className="rounded-full" />}
          <h1 className='text-3xl mt-4 font-bold tracking-tight text-gray-900 sm:text-5xl'>
            {store.name}
          </h1>
          <div className='text-lg max-w-prose text-muted-foreground mt-5'>
            {/* { description is html, render it as html } */}
            <div dangerouslySetInnerHTML={{ __html: store.description || '' }} />
          </div>
        </div>
        {
          categories && categories.map((category) => (
            <ProductReel
              key={category.id}
              query={{ sort: 'asc', limit: 4, category: category.id }}
              href={`${isSubdomain ? `/${category.slug}` : `/${storeSlug}/${category.slug}`}`} 
              title={category.name}
              isSubdomain={isSubdomain}
            />
          ))
        }

        {
          store.contactEmail &&
          <p className='text-center text-muted-foreground'>
            <Link href={`mailto:${extractEmail(store.contactEmail)}`}>
              <Button variant="link">
                Contacto: {extractEmail(store.contactEmail)}
              </Button>
            </Link>
          </p>
        }
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

