import { Card, CardContent } from "@/components/ui/card"
import { es } from "date-fns/locale"
import { getStoresDAO } from "@/services/store-services"
import { InstagramLogoIcon } from '@radix-ui/react-icons'
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { htmlToText } from "@/lib/utils"

export default async function AdminPage() {

  const data= await getStoresDAO()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full mt-4">
      {
        data.map(store => (
          <Card key={store.id} className="flex flex-col min-w-80 p-6 w-full shadow-md text-muted-foreground h-52">

            <div className="flex items-center mb-4 text-gray-900 font-bold justify-between">
              <Link href={`/${store.slug}`} prefetch={false} className="h-full flex items-center gap-2">
                {store.image && <Image src={store.image} alt={store.name} width={40} height={40} className="rounded-full" />}
                <p className="dark:text-white flex-1">{store.name}</p>
              </Link>
              <Link href={`https://instagram.com/${store.igHandle}`} prefetch={false} target="_blank">
                <InstagramLogoIcon className="w-6 h-6" />
              </Link>
                
            </div>
            <Link href={`/${store.slug}`} prefetch={false} className="h-full flex flex-col justify-between">
              <CardContent className="p-0 line-clamp-3">
              {htmlToText(store.description || '')}
              </CardContent>
              <p className="flex justify-end text-sm mt-2">{formatDistanceToNow(store.createdAt, { locale: es })}</p>
            </Link>
          </Card>
        ))
      }
    </div>
  )
}
