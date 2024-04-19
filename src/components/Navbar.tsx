import { auth } from '@/lib/auth'
import { CategoryDAO } from '@/services/category-services'
import { ProductDAO } from '@/services/product-services'
import { getStoreDAOBySlug } from '@/services/store-services'
import Image from 'next/image'
import Link from 'next/link'
import Cart from './Cart'
import MaxWidthWrapper from './MaxWidthWrapper'
import MobileNav from './MobileNav'
import NavItems from './NavItems'
import UserAccountNav from './UserAccountNav'
import { Button, buttonVariants } from './ui/button'
import MenuCategories from './header/menu-categories'

type Props= {
  storeSlug: string
  categories: CategoryDAO[]
  featuredProducts: ProductDAO[]
  isSubdomain: boolean
}

export default async function Navbar({ storeSlug, categories, featuredProducts, isSubdomain } : Props){
  
  const session = await auth();
  const user= session?.user

  const store= await getStoreDAOBySlug(storeSlug)
  if (!store) return <div></div>

  return (
    <div className='sticky z-50 top-0 inset-x-0 h-16 bg-red-50 w-full '>
      <header className='relative bg-white w-full border-b '>
        <MaxWidthWrapper>
          <div className=''>
            <div className='flex h-16 items-center'>
              <MobileNav categories={categories} featuredProducts={featuredProducts} />

              <div className='ml-4 flex lg:ml-0'>
                <Link key={store.id} href={isSubdomain ? `/` : `/${storeSlug}`}>
                  <Button variant="link">
                    <div className="flex items-center gap-2">
                      { store.image && <Image src={store.image} alt={store.name} width={40} height={40} className="rounded-full" />}
                    </div>
                  </Button>
                </Link>
              </div>

              <div className='hidden z-50 lg:ml-8 lg:block lg:self-stretch'>
                <MenuCategories isSubdomain={isSubdomain} categories={categories} />
              </div>

              <div className='ml-auto flex items-center'>
                <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6'>

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
                      href={isSubdomain ? `/micuenta` : `/${storeSlug}/micuenta`}
                      className={buttonVariants({
                        variant: 'ghost',
                      })}>
                      Mi cuenta
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


