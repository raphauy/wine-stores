"use client"

import { Button } from '@/components/ui/button'
import { OrderDAO } from '@/services/order-services'
import { OrderStatus } from '@prisma/client'
import React from 'react'

type Props = {
    order: OrderDAO
}
export default function MarkAsPaidButton({ order }: Props) {
    const status= order.status
    if (status !== OrderStatus.Pending) {
        return null
    }
    return (
        <Button variant="outline" size="sm">Marcar como pagada</Button>
    )
}
