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
  const hostUrl= process.env.NEXT_PUBLIC_URL?.split('//')[1] 
  const isSubdomain= hostUrl !== host

  const store= await getStoreDAOBySlug(storeSlug)

  const categories= store.categories

  if (!store || !store.image) {
    return <div>No se ha encontrado el Store</div>
  }
  return (
    <>
      <MaxWidthWrapper>
        <div className='pt-8 pb-10 mx-auto text-center flex flex-col items-center max-w-3xl'>
          { store.image && <Image src={store.image} alt={store.name} width={60} height={60} className="rounded-full" />}
          <h1 className='text-3xl mt-4 font-bold tracking-tight text-gray-900 sm:text-5xl'>
            {store.name}
          </h1>
          <p className='mt-6 text-lg max-w-prose text-muted-foreground'>
            Bienvenido a la tienda de <span className='font-bold'>{store.name}</span>. Cada botella en nuestra plataforma es cuidadosamente seleccionada por nuestro equipo para garantizar los más altos estándares de calidad.
          </p>
          {/* <div className='flex flex-col sm:flex-row gap-4 mt-6'>
            <Link
              href='/productos'
              className={buttonVariants()}>
              Explora lo Más Vendido
            </Link>
            <Button variant='ghost'>
              Nuestra promesa de calidad &rarr;
            </Button>
          </div> */}
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
