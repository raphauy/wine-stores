import Navbar from '@/components/Navbar'
import { constructMetadata } from '@/lib/utils'
import { getCategorysDAO } from '@/services/category-services'
import { getFeaturedProducts } from '@/services/product-services'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

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

  const host= headers().get('host')
  const hostUrl= process.env.NEXT_PUBLIC_URL?.split('//')[1] 
  const isSubdomain= hostUrl !== host


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
