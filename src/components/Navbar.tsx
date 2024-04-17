import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { Icons } from './Icons'
import { Button, buttonVariants } from './ui/button'
import Cart from './Cart'
import { cookies } from 'next/headers'
import UserAccountNav from './UserAccountNav'
import { CategoryDAO } from '@/services/category-services'
import { ProductDAO } from '@/services/product-services'
import { auth } from '@/lib/auth'
import MobileNav from './MobileNav'
import { getStoreDAOBySlug } from '@/services/store-services'
import NavItems from './NavItems'
import Image from 'next/image'

type Props= {
  storeSlug: string
  categories: CategoryDAO[]
  featuredProducts: ProductDAO[]
}

export default async function Navbar({ storeSlug, categories, featuredProducts } : Props){
  const nextCookies = cookies()
  const session = await auth();
  const user= session?.user

  const store= await getStoreDAOBySlug(storeSlug)

  return (
    <div className='sticky z-50 top-0 inset-x-0 h-16 bg-red-50 w-full '>
      <header className='relative bg-white w-full border-b '>
        <MaxWidthWrapper>
          <div className=''>
            <div className='flex h-16 items-center'>
              <MobileNav categories={categories} featuredProducts={featuredProducts} />

              <div className='ml-4 flex lg:ml-0'>
                <Link key={store.id} href={`/${store.slug}`}>
                  <Button variant="ghost">
                    <div className="flex items-center gap-2">
                      { store.image && <Image src={store.image} alt={store.name} width={40} height={40} className="rounded-full" />}
                    </div>
                  </Button>
                </Link>
              </div>

              <div className='hidden z-50 lg:ml-8 lg:block lg:self-stretch'>
                <NavItems categories={categories} featuredProducts={featuredProducts} />
              </div>

              <div className='ml-auto flex items-center'>
                <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6'>
                  {user ? null : (
                    <Link
                      href='/sign-in'
                      className={buttonVariants({
                        variant: 'ghost',
                      })}>
                      Login
                    </Link>
                  )}

                  {user ? null : (
                    <span
                      className='h-6 w-px bg-gray-200'
                      aria-hidden='true'
                    />
                  )}

                  {user ? (
                    <UserAccountNav user={user} />
                  ) : (
                    <Link
                      href='/sign-up'
                      className={buttonVariants({
                        variant: 'ghost',
                      })}>
                      Crear cuenta
                    </Link>
                  )}

                  {user ? (
                    <span
                      className='h-6 w-px bg-gray-200'
                      aria-hidden='true'
                    />
                  ) : null}

                  {user ? null : (
                    <div className='flex lg:ml-6'>
                      <span
                        className='h-6 w-px bg-gray-200'
                        aria-hidden='true'
                      />
                    </div>
                  )}

                  <div className='ml-4 flow-root lg:ml-6'>
                    <Cart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  )
}


