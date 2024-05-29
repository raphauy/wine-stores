import Navbar from '@/components/Navbar'
import { constructMetadata, htmlToText } from '@/lib/utils'
import { getCategorysDAO } from '@/services/category-services'
import { getFeaturedProducts } from '@/services/product-services'
import { getStoreDAOBySlug } from '@/services/store-services'
import { Metadata, ResolvingMetadata } from 'next'
import { headers } from 'next/headers'
import { Toaster } from 'sonner'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const storeSlug = params.storeSlug
  const store = await getStoreDAOBySlug(storeSlug)
 
  return {
    title: store?.name,
    description: store?.description,
    openGraph: {
      title: store?.name,
      description: store?.description,
      url: `${store?.mpRedirectUrl}`,
      // images: [
      //   {
      //     url: `${store?.mpRedirectUrl}/favicon.ico`,
      //     width: 1200,
      //     height: 630,
      //     alt: store?.name,
      //   },
      // ],
    },
  }
}

type Props= {
  children: React.ReactNode
  params: {
    storeSlug: string
  }
}
export default async function RootLayout({ children, params }: Props) {
  const storeSlug= params.storeSlug
  const categories= await getCategorysDAO(storeSlug)
  const featuredProducts= await getFeaturedProducts(storeSlug)

  const host= headers().get('host')
  const serverUrls= process.env.NEXT_PUBLIC_SERVER_HOSTs!.split(",")
  const isServer= serverUrls.some((serverUrl) => host ===serverUrl)
  const isSubdomain= !isServer


  return (
    <main className='w-full'>
      <div className='relative flex flex-col w-full'>
        <Navbar categories={categories} featuredProducts={featuredProducts} storeSlug={storeSlug} isSubdomain={isSubdomain} />
        <div className='flex-grow flex-1'>
          {children}
        </div>
      </div>

      <Toaster position='top-center' richColors />
    </main>
)
}
