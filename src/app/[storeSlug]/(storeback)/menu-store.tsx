"use client"

import { useAdminRoles } from "@/app/admin/users/use-roles"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BadgeDollarSign, Box, CreditCard, ListChecks, ShoppingBasket, Store, Tag, User } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

type Props= {
  isSubdomain: boolean
}
export default function MenuStore({ isSubdomain }: Props) {
    
    const user= useSession().data?.user
    const userRole= user?.role
    const alowedRoles= useAdminRoles()

    const path= usePathname()
    const params= useParams()

    if (!user)
        return <div></div>

    const storeSlug= params.storeSlug
    if (!storeSlug)
        return <div>Store not found</div>

    const basePath= isSubdomain ? "" : `/${storeSlug}` 
    
    const data= [
        {
            href: `${basePath === "" ? "/" : basePath}`,
            icon: Store,
            text: "Tienda",
            roles: alowedRoles
        },
        {
            href: `${basePath}/users`,
            icon: User,
            text: "Usuarios",
            roles: alowedRoles
        },
        {
            href: `${basePath}/categories`,
            icon: Tag,
            text: "Categorías",
            roles: alowedRoles
        },
        {
            href: `${basePath}/products`,
            icon: ShoppingBasket, 
            text: "Productos",
            roles: alowedRoles
        },
        {
            href: `${basePath}/inventory`,
            icon: ListChecks,  
            text: "Inventario",
            roles: alowedRoles
        },
        {
            href: `${basePath}/orders`,
            icon: BadgeDollarSign, 
            text: "Ventas",
            roles: alowedRoles
        },
    ]
        
    return (
        <nav>
            <ul className="flex items-center">
                {data.map((item, index) => {
                    if (item.roles && userRole && !item.roles.includes(userRole))
                        return null
                    return (
                        <li key={index} className={cn("border-b-primary", path === item.href && "border-b-2")}>
                            <Link href={item.href}>
                                <Button variant="ghost">
                                    <item.icon className="w-4 h-4 mr-1 mb-0.5" />
                                    {item.text}
                                </Button>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}

