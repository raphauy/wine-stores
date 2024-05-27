"use client"

import { useCart } from '@/hooks/use-cart'
import { useEffect } from 'react'

export default function CleanCart() {
    const { clearCart } = useCart()

    useEffect(() => {
        clearCart()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return null
}
