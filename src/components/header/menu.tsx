"use client"

import { useSession } from "next-auth/react"
import { useParams, usePathname } from "next/navigation"
import MenuStore from "../../app/[storeSlug]/(storeback)/menu-store"
import MenuAdmin from "../../app/admin/menu-admin"

type Props= {
    isSubdomain: boolean
  }
  
export default function Menu({ isSubdomain }: Props) {

    const user= useSession().data?.user

    const params= useParams()    
    const path= usePathname()

    const storeSlug= params.storeSlug

    let menu
    if (path.startsWith("/admin")) {
        menu= <MenuAdmin />
    } else if (storeSlug) {
        menu= <MenuStore isSubdomain={isSubdomain} />
    } else {
        menu= null    
    }



    return (
        <div className="flex justify-between">
            {menu}
            
            {user && <p className="mr-4">{user?.name} - {user?.role}</p>}
        </div>
    )
}

