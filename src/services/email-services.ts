import { sendOrderConfirmationEmail } from "@/lib/mail";
import { getFullOrderDAO } from "./order-services";
import { StockMovementFormValues, createStockMovement } from "./stockmovement-services";
import { MovementType, OrderStatus } from "@prisma/client";
import { getInventoryItemDAOByProductId } from "./inventoryitem-services";
import { getStoreDAO } from "./store-services";
import { Resend } from "resend"


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

export async function sendEmailConfirmation(storeId: string, emailTo: string) {
    console.log("Sending email confirmation to: ", emailTo);
  
    const store = await getStoreDAO(storeId)
    if (!store || !store.emailFrom || !store.emailConfirmationHtml) {
      console.log("Error sending email confirmation, data validation failed.")
      console.log("store: ", store)
      
      throw new Error("Error sending email confirmation")
    }

    const linkMiCuenta= `<a href="${store.mpRedirectUrl}/micuenta?email=${emailTo}&storeId=${storeId}">Mi cuenta</a>`
    const html= store.emailConfirmationHtml.replaceAll("LINK_MI_CUENTA", linkMiCuenta)
  
    const resend = new Resend(process.env.RESEND_API_KEY);
  
    const { data, error } = await resend.emails.send({
      from: store.emailFrom,
      to: [emailTo],
      subject: "Test email",
      html,
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
  