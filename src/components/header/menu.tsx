"use client"

import { useSession } from "next-auth/react"
import { useParams, usePathname } from "next/navigation"
import MenuAdmin from "./menu-admin"
import MenuStore from "./menu-store"

export default function Menu() {

    const user= useSession().data?.user

    const params= useParams()    
    const path= usePathname()

    const storeSlug= params.storeSlug


    let menu
    if (path.startsWith("/admin")) {
        menu= <MenuAdmin />
    } else if (storeSlug) {
        menu= <MenuStore />
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

