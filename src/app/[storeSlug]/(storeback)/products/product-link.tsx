"use client"

import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import Link from "next/link"

type Props= {
  productId: string
  storeSlug: string
}
export default function ProductLink({ productId, storeSlug }: Props) {

    const host= window ? window.location.host : ""
    const hostUrl= process.env.NEXT_PUBLIC_URL?.split('//')[1] 
    const isSubdomain= hostUrl !== host

    return (
        <Link href={`${isSubdomain ? `/products/${productId}` : `/${storeSlug}/products/${productId}`}`} >
          <Button variant="ghost">
              <Pencil />
          </Button>
        </Link>

    )
} 