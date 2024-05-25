import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Logo from "@/components/header/logo";
import { Button, buttonVariants } from '@/components/ui/button'
import { getCurrentUser } from "@/lib/utils";
import { getFullStoresDAO } from "@/services/store-services";
import { ArrowDownToLine, CheckCircle, Leaf, Truck } from 'lucide-react'
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const perks = [
  {
    name: 'Entrega Premium',
    Icon: Truck,
    description:
      'Recibe tu selección de vinos directamente en tu puerta con opciones de entrega el mismo día en áreas seleccionadas.',
  },
  {
    name: 'Calidad Certificada',
    Icon: CheckCircle,
    description:
      'Cada botella proviene de viñedos verificados y ha pasado por un riguroso control de calidad. Si no estás satisfecho, ofrecemos una garantía de devolución de 30 días.',
  },
  {
    name: 'Compromiso Ecológico',
    Icon: Leaf,
    description:
      'Contribuimos con el 1% de cada venta al cuidado y preservación de los viñedos y su entorno natural.',
  },
]

export default async function Home() {
  const user= await getCurrentUser()

  const role= user && user.role
  if (role === "ADMIN")
    redirect("/admin")

  const storeSlug= user && user.storeSlug

  if (role?.startsWith("STORE"))
    redirect(`/${storeSlug}`)

  if (role === "CLIENT")
    redirect("/micuenta")

  const stores= await getFullStoresDAO()

  return (
    <>
      <MaxWidthWrapper>
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className='py-10 mx-auto text-center flex flex-col items-center max-w-3xl'>
          <h1 className='text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl'>
          Conectamos a <span className='text-blue-600'>pequeños productores</span> con el mundo digital.
          </h1>
          <p className='mt-6 text-lg max-w-prose text-muted-foreground'>
            Bienvenido a latidio.com. Cada botella en nuestra plataforma es cuidadosamente seleccionada por nuestro equipo para garantizar los más altos estándares de calidad.
          </p>
          <p className='mt-6 text-lg max-w-prose text-muted-foreground'>
            Explora nuestras tiendas:
          </p>
          <div className='flex flex-col sm:flex-row gap-4 mt-6'>
            {
              stores.map(store => {
                return (
                  <Link key={store.id} href={`/${store.slug}`}>
                    <Button variant="ghost" className="whitespace-nowrap min-w-[230px]">
                      <div className="flex items-center gap-2">
                        { store.image && <Image src={store.image} alt={store.name} width={20} height={20} className="rounded-full" />}
                        <p className="dark:text-white">{store.name}</p>
                      </div>
                    </Button>
                  </Link>
      
              )})
            }
          </div>
        </div>
        {/* <ProductReel
          query={{ sort: 'desc', limit: 4 }}
          href='/products?sort=recent'
          title='Brand new'
        /> */}
      </MaxWidthWrapper>

      <section className='border-t border-gray-200 bg-gray-50 dark:bg-black dark:text-white'>
        <MaxWidthWrapper className='py-20'>
          <div className='grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0'>
            {perks.map((perk) => (
              <div
                key={perk.name}
                className='text-center md:flex md:items-start md:text-left lg:block lg:text-center'>
                <div className='md:flex-shrink-0 flex justify-center'>
                  <div className='h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900'>
                    {<perk.Icon className='w-1/3 h-1/3' />}
                  </div>
                </div>

                <div className='mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6'>
                  <h3 className='text-base font-medium text-gray-900 dark:text-white'>
                    {perk.name}
                  </h3>
                  <p className='mt-3 text-sm text-muted-foreground'>
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
      <section className='border-t border-gray-200 bg-gray-50 dark:bg-black dark:text-white w-full'>
        <div className='text-center py-10 relative mx-auto max-w-sm'>
          <h3 className='font-semibold text-gray-900 dark:text-white'>
            Únete como vendedor
          </h3>
          <p className='mt-2 text-sm text-muted-foreground'>
            Si deseas vender vinos de alta calidad, puedes empezar en cuestión de minutos.{' '}
            <Button variant="link">
              Comienza ahora &rarr;
            </Button>
          </p>
        </div>
      </section>
    </>
  )
}
