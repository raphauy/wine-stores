import { MovementType, OrderStatus } from "@prisma/client";
import { Resend } from "resend";
import { getInventoryItemDAOByProductId } from "./inventoryitem-services";
import { getFullOrderDAO } from "./order-services";
import { StockMovementFormValues, createStockMovement } from "./stockmovement-services";
import PaymentConfirmationEmail from "@/components/email/payment-confirmation-email";
import { format } from "date-fns";
import BankDataEmail from "@/components/email/bank-data-email";
import { getStoreDAO } from "./store-services";
import CodeVerifyEmail from "@/components/email/verify-email";
import NotifyPaymentEmail from "@/components/email/notify-payment";


export async function processOrderConfirmation(orderId: string) {
    const order = await getFullOrderDAO(orderId)
    const status= order.status
    if (status === OrderStatus.Paid) {
        console.log("Order already paid")
        return
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
    
    await sendPaymentConfirmationEmail(order.id)
    await sendNotifyPaymentEmail(order.id)
}

  
export async function sendPaymentConfirmationEmail(orderId: string, testEmailTo?: string) {
  const order = await getFullOrderDAO(orderId)
  const store = order.store
  if (!store || !store.emailFrom || !store.mpRedirectUrl) {
    console.log("Error sending email confirmation, data validation failed. Probably emalFrom is not set.")
    console.log("store: ", store)
    
    throw new Error("Error sending email confirmation")
  }

  let from= process.env.DEFAULT_EMAIL_FROM!
  let reply_to= process.env.SUPPORT_EMAIL!
  from= store.emailFrom ? store.emailFrom : process.env.DEFAULT_EMAIL_FROM!
  reply_to= store.contactEmail ? store.contactEmail : process.env.SUPPORT_EMAIL!

  let subject = "Compraste "
  const items= order.orderItems
  for (const item of items) {
    subject += `${item.soldName}${item.quantity > 1 ? ` x ${item.quantity}` : ""}, `
  }
  subject = subject.slice(0, -2)
  const totalPrice= order.orderItems.reduce((acc, item) => acc + item.soldUnitPrice * item.quantity, 0)
  const finalText= "En breve nos pondremos en contacto contigo con información sobre el envío."

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from,
    to: testEmailTo ? testEmailTo : order.email.trim(),
    reply_to,
    subject,
    react: PaymentConfirmationEmail({ 
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

export async function sendBankDataEmail(orderId: string, testEmailTo?: string) {
  const order = await getFullOrderDAO(orderId)
  const store = order.store
  if (!store || !store.emailFrom || !store.mpRedirectUrl) {
    console.log("Error sending bank data email, data validation failed. Probably emalFrom is not set.")
    console.log("store: ", store)
    
    throw new Error("Error sending email confirmation")
  }
  let from= process.env.DEFAULT_EMAIL_FROM!
  let reply_to= process.env.SUPPORT_EMAIL!
  from= store.emailFrom ? store.emailFrom : process.env.DEFAULT_EMAIL_FROM!
  reply_to= store.contactEmail ? store.contactEmail : process.env.SUPPORT_EMAIL!

  const subject = "Datos bancarios para realizar el pago"
  const totalPrice= order.orderItems.reduce((acc, item) => acc + item.soldUnitPrice * item.quantity, 0)
  const finalText= `
Una vez que hayas realizado el pago, debes ingrear a 'Mi cuenta' y marcar la orden como pagada.
Aquí abajo tienes el boton para hacerlo:
`
  const bankData= store.bankData

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from,
    to: testEmailTo ? testEmailTo : order.email.trim(),
    reply_to,
    subject,
    react: BankDataEmail({ 
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
      finalText,
      bankData
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

export async function sendCodeEmail(storeId: string | null | undefined, email: string, code: string) {
  let storeName= "Latidio"
  let from= process.env.DEFAULT_EMAIL_FROM!
  const contactEmail= process.env.SUPPORT_EMAIL!
  let reply_to= process.env.SUPPORT_EMAIL!
  

  if (storeId) {
    const store= await getStoreDAO(storeId)
    if (store) {
      storeName= store.name
      from= store.emailFrom ? store.emailFrom : process.env.DEFAULT_EMAIL_FROM!
      reply_to= store.contactEmail ? store.contactEmail : process.env.SUPPORT_EMAIL!
    }
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from,
    to: email,
    reply_to,
    subject: `Código de acceso a ${storeName}`,
    react: CodeVerifyEmail({ 
      validationCode: code,
      sotreName: storeName, 
      contactEmail,
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
}

export async function sendNotifyPaymentEmail(orderId: string, testEmailTo?: string) {
  const order = await getFullOrderDAO(orderId)
  const store = order.store
  if (!store || !store.emailFrom || !store.mpRedirectUrl) {
    console.log("Error sending notify payment email, data validation failed. Probably emalFrom is not set.")
    console.log("store: ", store)
    
    throw new Error("Error sending email confirmation")
  }
  let from= process.env.DEFAULT_EMAIL_FROM!
  let reply_to= process.env.SUPPORT_EMAIL!
  from= store.emailFrom ? store.emailFrom : process.env.DEFAULT_EMAIL_FROM!
  reply_to= store.contactEmail ? store.contactEmail : process.env.SUPPORT_EMAIL!
  let to= store.contactEmail ? store.contactEmail : process.env.SUPPORT_EMAIL!

  const subject = "Notificación de pago"
  const totalPrice= order.orderItems.reduce((acc, item) => acc + item.soldUnitPrice * item.quantity, 0)

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from,
    to: testEmailTo ? testEmailTo : to,
    reply_to,
    subject,
    react: NotifyPaymentEmail({ 
      store: store,
      buyerName: order.name,
      buyerEmail: order.email,
      paymentAmount: totalPrice,
      paymentMethod: order.paymentMethod,
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