"use server"

import { CartItem } from "@/hooks/use-cart"
import { OrderFormValues, createOrder, processOrder } from "@/services/order-services"
import { OrderItemFormValues, createOrderItem } from "@/services/orderitem-services"
import { getStoreDAOBySlug } from "@/services/store-services"
import { PaymentMethod } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

type OrderItem= {
    quantity: number
    productId: string
}

export async function createOrderAction(paymentMethod: PaymentMethod, storeSlug: string, items: CartItem[], email: string, name: string, address: string, city: string, phone: string) {
    console.log("createOrder", paymentMethod)
    console.log(email, name, address, city, phone)
    console.log("items:", items)

    const store= await getStoreDAOBySlug(storeSlug)
    console.log("store:", store.name)    

    // shipping cost is the the top shipping cost of all items
    let shippingCost= 0
    items.forEach((item) => {
        if (item.product.shippingCost > shippingCost) {
            shippingCost= item.product.shippingCost
        }
    })
    const orderForm: OrderFormValues = {
        paymentMethod,
        storeId: store.id,
        email,
        name,
        address,
        city,
        phone,
        shippingCost: Number(shippingCost).toFixed(2),
    }

    const orderCreated= await createOrder(orderForm, storeSlug)
    const orderId= orderCreated.id

    const orderItems: OrderItem[]= []
    
    // CartItems have no quantity, so we need to get the quantity counting the items with the same productId
    items.forEach((item) => {
        const found= orderItems.find(orderItem => orderItem.productId === item.product.id)
        if (found) {
            orderItems.splice(orderItems.indexOf(found), 1)
            orderItems.push({ quantity: found.quantity + 1, productId: item.product.id })
        } else {
            orderItems.push({ quantity: 1, productId: item.product.id })
        }
    })

    const orderItemsForm: OrderItemFormValues[] = orderItems.map((item) => {
        return {
            orderId,
            productId: item.productId,
            quantity: item.quantity,
        }
    })

    try {
        for (const orderItem of orderItemsForm) {
            await createOrderItem(orderItem)
        }
    } catch (error) {
        console.log(error)
        throw new Error("Error al crear la orden")
    }

    revalidatePath("/[storeSlug]/orders", "page")

    let redirectUrl= null

    try {
        console.log("processOrder")
        redirectUrl= await processOrder(orderId)
    } catch (error) {
        console.log(error)
        throw new Error("Error al procesar la orden")
    }

    console.log("redirectUrl:", redirectUrl)
    if (redirectUrl) {
        redirect(redirectUrl)        
    } else {
        console.log("redirectUrl is null")            
    }

    return "ok" 
}

