import { sendOrderConfirmationEmail } from "@/lib/mail";
import { getFullOrderDAO } from "./order-services";
import { StockMovementFormValues, createStockMovement } from "./stockmovement-services";
import { MovementType, OrderStatus } from "@prisma/client";
import { getProductDAO } from "./product-services";
import { getInventoryItemDAOByProductId } from "./inventoryitem-services";


export async function processOrderConfirmation(orderId: string) {
    const order = await getFullOrderDAO(orderId)
    const status= order.status
    if (status === OrderStatus.Paid) {
        console.log("Order already paid")
        return
    }
    const email = order.email
    const store = order.store

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
    
    let storeUrl= store.mpRedirectUrl
    if (storeUrl?.endsWith("/")){
        storeUrl= storeUrl.slice(0, -1) 
    }
    const url= `${storeUrl}/micuenta?email=${email}&storeId=${store.id}`

    console.log("processOrderConfirmation", order)    

    await sendOrderConfirmationEmail(email, order, url)
}