import { sendOrderConfirmationEmail } from "@/lib/mail";
import { MovementType, OrderStatus } from "@prisma/client";
import { Resend } from "resend";
import { getInventoryItemDAOByProductId } from "./inventoryitem-services";
import { getFullOrderDAO } from "./order-services";
import { StockMovementFormValues, createStockMovement } from "./stockmovement-services";
import { getStoreDAO } from "./store-services";
import OrderEmail from "@/components/email/order-email";
import { format } from "date-fns";


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

  
export async function sendMLConfirmationEmail(orderId: string, testEmailTo?: string) {
  const order = await getFullOrderDAO(orderId)
  const store = order.store
  if (!store || !store.emailFrom || !store.mpRedirectUrl) {
    console.log("Error sending email confirmation, data validation failed. Probably emalFrom is not set.")
    console.log("store: ", store)
    
    throw new Error("Error sending email confirmation")
  }

  let subject = "Compraste "
  const items= order.orderItems
  for (const item of items) {
    subject += `${item.soldName}${item.quantity > 1 ? ` x ${item.quantity}` : ""}, `
  }
  subject = subject.slice(0, -2)
  const totalPrice= order.orderItems.reduce((acc, item) => acc + item.soldUnitPrice * item.quantity, 0)
  const finalText= `
En breve nos pondremos en contacto contigo para brindarte información sobre el envío.

Gracias por la compra,
Gabi
`

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: store.emailFrom,
    to: testEmailTo ? testEmailTo : order.email.trim(),
    subject,
    react: OrderEmail({ 
      storeName: store.name, 
      storeId: store.id, 
      orderEmail: order.email, 
      orderId: order.id,
      baseUrl: store.mpRedirectUrl,
      formattedDate: format(order.createdAt, "dd MMM yyyy"),
      name: order.name,
      address: order.address,
      city: order.city,
      phone: order.phone,
      items: order.orderItems,
      totalPrice,
      finalText
    }),
  });

  if (error) {
    console.log("Error sending test email")    
    console.log("error.name:", error.name)    
    console.log("error.message:", error.message)
    return false
  } else {
    console.log("email result: ", data)
  }

  return true
}