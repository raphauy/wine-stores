"use client"

import { useAdminRoles } from "@/app/admin/users/use-roles"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CategoryDAO } from "@/services/category-services"
import { ShoppingBasket, Store, Tag, User } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

const publicUrl= process.env.NEXT_PUBLIC_URL!

type Props= {
  isSubdomain: boolean
  categories: CategoryDAO[]
}
export default function MenuCategories({ isSubdomain, categories }: Props) {
    
    const clientSlug= useParams().clientSlug
    
    const path= usePathname()
    const params= useParams()

    const storeSlug= params.storeSlug
    if (!storeSlug)
        return <div>Store not found</div>

    if (clientSlug)
        return <div></div>

    return (
        <nav className="h-full flex items-center">
            <ul className="flex items-center">
                {categories.map((category, index) => {
                    const href= isSubdomain ? `/${category.slug}` : `/${storeSlug}/${category.slug}`
                    return (
                        <li key={index} className={cn("border-b-primary", path.includes(category.slug) && "border-b-2")}>
                            <Link href={href}>
                                <Button variant="ghost">
                                    {category.name}
                                </Button>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}

