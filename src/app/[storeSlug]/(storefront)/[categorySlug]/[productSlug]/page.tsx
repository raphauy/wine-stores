import AddToCartButton from '@/components/AddToCartButton'
import ImageSlider from '@/components/ImageSlider'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProductReel from '@/components/ProductReel'
import CheckoutButton from '@/components/checkout-button'
import { Button } from '@/components/ui/button'
import { cn, constructMetadata, formatPrice } from '@/lib/utils'
import { getProductDAOBySlug } from '@/services/product-services'
import { Check, Shield } from 'lucide-react'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productSlug = params.productSlug
  const storeSlug = params.storeSlug
  const categorySlug = params.categorySlug
  const product = await getProductDAOBySlug(storeSlug, categorySlug, productSlug)
  const store= product?.category?.store
 
  return {
    title: product?.name + ' - ' + product?.category.name + ' - ' + store?.name,
    description: product?.description,
    openGraph: {
      title: store?.name,
      description: store?.description,
      url: `${store?.mpRedirectUrl}/${categorySlug}/${productSlug}`,
      images: [
        {
          url: `${product.images[0].url}`,
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
    productSlug: string
  }
}

export default async function ProductoPage({ params }: Props) {

  const storeSlug = params.storeSlug
  const categorySlug = params.categorySlug
  const productSlug= params.productSlug

  const product = await getProductDAOBySlug(storeSlug, categorySlug, productSlug)

  if (!product) 
    return notFound()

  const host= headers().get('host')
  const serverUrls= process.env.NEXT_PUBLIC_SERVER_HOSTs!.split(",")
  const isServer= serverUrls.some((serverUrl) => host ===serverUrl)
  const isSubdomain= !isServer

  const categoryHref= isSubdomain ? `/${categorySlug}` : `/${storeSlug}/${categorySlug}` 
  const homeHref= isSubdomain ? `/` : `/${storeSlug}`

  const BREADCRUMBS = [
    { id: 1, name: 'Inicio', href: homeHref },
    { id: 2, name: `${product.category.name}`, href: categoryHref },
  ]
  
  const validUrls = product.images.map((image) => image.url)

  return (
    <MaxWidthWrapper className=''>
      <div className=''>
        <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8'>
          {/* Product Details */}
          <div className='lg:max-w-lg lg:self-end'>
            <ol className='flex items-center space-x-2'>
              {BREADCRUMBS.map((breadcrumb, i) => (
                <li key={breadcrumb.href}>
                  <div className='flex items-center text-sm'>
                    {/* <Link
                      href={breadcrumb.href}
                      className='font-medium text-sm text-muted-foreground hover:text-gray-900'>
                      {breadcrumb.name}
                    </Link> */}
                    <Link href={breadcrumb.href}>
                      <Button variant="link" className='text-muted-foreground'>
                        {breadcrumb.name}
                      </Button>
                    </Link>

                    {i !== BREADCRUMBS.length - 1 ? (
                      <svg
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        aria-hidden='true'
                        className='ml-2 h-5 w-5 flex-shrink-0 text-gray-300'>
                        <path d='M5.555 17.776l8-16 .894.448-8 16-.894-.448z' />
                      </svg>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>

            <div className='mt-4'>
              <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white'>
                {product.name}
              </h1>
            </div>

            <section className='mt-4'>
              {
                product.discountPrice !== 0 &&
                  <p className='font-medium dark:text-white text-red-500 line-through'>
                    {formatPrice(product.price)}
                  </p>
              }
              <div className='flex items-center'>
                <p className='font-medium text-gray-900 dark:text-white'>
                  {formatPrice(product.discountPrice ? product.discountPrice : product.price)}
                </p>
                <div className='ml-4 border-l text-muted-foreground border-gray-300 pl-4'>
                  {product.category.name}
                </div>
              </div>

              <div className='mt-4 space-y-6'>
                <p className='text-base text-muted-foreground whitespace-pre-line'>
                  {product.description}
                </p>
              </div>

              <div className={cn("mt-6 flex items-center", !product.deliveryInfo && "hidden")}>
                <Check
                  aria-hidden='true'
                  className='h-5 w-5 flex-shrink-0 text-green-500'
                />
                <p className='ml-2 text-sm text-muted-foreground'>
                  {product.deliveryInfo}
                </p>
              </div>
            </section>
          </div>

          {/* Product images */}
          <div className='mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center'>
            <div className='aspect-square rounded-lg border'>
              <ImageSlider urls={validUrls} />
            </div>
          </div>

          {/* add to cart part */}
          <div className='mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start'>
            <div>
              <div className='mt-10 h-24'>
                <AddToCartButton product={product} />
                <CheckoutButton />
              </div>
              <div className='mt-6 text-center'>
                <div className='group inline-flex text-sm text-medium'>
                  <Shield
                    aria-hidden='true'
                    className='mr-2 h-5 w-5 flex-shrink-0 text-gray-400'
                  />
                  <span className='text-muted-foreground hover:text-gray-700'>
                    Satisfacción garantizada
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductReel
        href={isSubdomain ? `/${product.category.slug}` : `/${storeSlug}/${product.category.slug}`}
        query={{ category: product.category.id, limit: 4 }}
        title={`Productos similares`}
        subtitle={`Encuentra productos similares a '${product.name}' en ${product.category.name}`}
        isSubdomain={isSubdomain}
      />
    </MaxWidthWrapper>
  )
}


