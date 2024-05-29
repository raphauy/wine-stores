import { MovementType, OrderStatus, PaymentMethod } from "@prisma/client"
import { getFullOrderDAO, setOrderStatus } from "./order-services"
import { getInventoryItemDAOByProductId } from "./inventoryitem-services"
import { StockMovementFormValues, createStockMovement } from "./stockmovement-services"
import { sendBankDataEmail, sendNotifyPaymentEmail, sendNotifyTransferSentEmail, sendPaymentConfirmationEmail } from "./email-services"

export async function processOrderConfirmation(orderId: string) {
    const order = await getFullOrderDAO(orderId)
    const status= order.status
    if (status === OrderStatus.Paid) {
        console.log("Order already paid")
        return null
    }

    const items= order.orderItems
    for (const item of items) {
        const inventoryItem= await getInventoryItemDAOByProductId(item.productId)
        const stockMovement: StockMovementFormValues = {
            type: MovementType.SALIDA,
            inventoryItemId: inventoryItem.id,
            quantity: item.quantity.toString(),
            comment: "Venta de " + item.soldName
        }
        await createStockMovement(stockMovement)
    }

    const updated= await setOrderStatus(orderId, OrderStatus.Paid)
    if (!updated) {
        return null
    }
    
    await sendPaymentConfirmationEmail(order.id)
    await sendNotifyPaymentEmail(order.id)

    return updated
}

export async function setOrderTransferenciaBancariaPending(orderId: string) {
    const order= await getFullOrderDAO(orderId)
    if (!order)
        throw new Error("No se encontro la orden")
    if (order.status !== OrderStatus.Created) {
        console.log("order is not in status Created, status:", order.status)
        return
    } else {
        console.log("setting order to status Pending")
    }

    const updated= await setOrderStatus(orderId, OrderStatus.Pending)
    if (!updated) {
        return null
    }

    await sendBankDataEmail(order.id)

return updated
}


export async function setOrderTransferenciaBancariaPaymentSent(orderId: string) {
    const order= await getFullOrderDAO(orderId)
    if (!order)
        throw new Error("No se encontro la orden")
    if (order.status !== OrderStatus.Pending) {
        console.log("order is not in status Pending, status:", order.status)
        return order
    } else {
        console.log("setting order to status PaymentSent")
    }

    const updated= await setOrderStatus(orderId, OrderStatus.PaymentSent)
    if (!updated) {
        return null
    }

    await sendNotifyTransferSentEmail(order.id)

    return updated
}
  

export async function setOrderMercadoPagoNotApproved(orderId: string) {
    const order= await getFullOrderDAO(orderId)
    if (!order)
        throw new Error("No se encontró la orden")
    if (order.paymentMethod !== PaymentMethod.MercadoPago) {
        console.log("order is not in payment method MercadoPago, paymentMethod:", order.paymentMethod)
        return
    }
    if (order.status !== OrderStatus.Pending) {
        console.log("order is not in status Pending, status:", order.status)
        return
    } else {
        console.log("setting order to status Rejected")
    }

    const updated= await setOrderStatus(orderId, OrderStatus.Rejected)
    if (!updated) {
        return null
    }

    return updated
}