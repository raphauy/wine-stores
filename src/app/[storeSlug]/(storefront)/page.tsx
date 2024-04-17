import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button, buttonVariants } from '@/components/ui/button'
import { getStoreDAOBySlug } from '@/services/store-services'
import { ArrowDownToLine, CheckCircle, Leaf, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
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

  const store= await getStoreDAOBySlug(storeSlug)
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
          <div className='flex flex-col sm:flex-row gap-4 mt-6'>
            <Link
              href='/productos'
              className={buttonVariants()}>
              Explora lo Más Vendido
            </Link>
            <Button variant='ghost'>
              Nuestra promesa de calidad &rarr;
            </Button>
          </div>
        </div>
        {/* <ProductReel
          query={{ sort: 'desc', limit: 4 }}
          href='/products?sort=recent'
          title='Brand new'
        /> */}
      </MaxWidthWrapper>

      <section className='border-t border-gray-200 bg-gray-50'>
        <MaxWidthWrapper className='py-20 text-center'>
          <p>productos destacados</p>
        </MaxWidthWrapper>
      </section>
    </>
  )
}
