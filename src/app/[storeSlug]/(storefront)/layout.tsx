import Navbar from '@/components/Navbar'
import { constructMetadata, htmlToText } from '@/lib/utils'
import { getCategorysDAO } from '@/services/category-services'
import { getFeaturedProducts } from '@/services/product-services'
import { getStoreDAOBySlug } from '@/services/store-services'
import { headers } from 'next/headers'
import { Toaster } from 'sonner'

export const metadata = constructMetadata()

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

  const store= await getStoreDAOBySlug(storeSlug)
  
  metadata.title= `2-${store?.name || 'Tienda'}`
  metadata.description= htmlToText(store?.description || '')

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
