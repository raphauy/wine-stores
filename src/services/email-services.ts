import BankDataEmail from "@/components/email/bank-data-email";
import NotifyPaymentEmail from "@/components/email/notify-payment";
import PaymentConfirmationEmail from "@/components/email/payment-confirmation-email";
import CodeVerifyEmail from "@/components/email/verify-email";
import { completeWithZeros } from "@/lib/utils";
import { format } from "date-fns";
import { Resend } from "resend";
import { getFullOrderDAO } from "./order-services";
import { getStoreDAO } from "./store-services";
import NotifyTransferEmail from "@/components/email/notify-transfer";



  
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

  const storeOrderNumber= `${order.store.prefix}#${completeWithZeros(order.storeOrderNumber)}`

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from,
    to: testEmailTo ? testEmailTo : order.email.trim(),
    //bcc: process.env.NODE_ENV === "production" ? process.env.SUPPORT_EMAIL : "",
    reply_to,
    subject,
    react: PaymentConfirmationEmail({ 
      storeName: store.name, 
      storeId: store.id, 
      orderName: order.name,
      orderEmail: order.email, 
      storeOrderNumber,
      baseUrl: store.mpRedirectUrl,
      formattedDate: format(order.createdAt, "dd MMM yyyy"),
      name: order.name,
      address: order.address,
      city: order.city,
      phone: order.phone,
      items: order.orderItems,
      totalPrice,
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

  const subject = "Datos bancarios para realizar el pago, orden: " + store.prefix + "#" + completeWithZeros(order.storeOrderNumber)
  const totalPrice= order.orderItems.reduce((acc, item) => acc + item.soldUnitPrice * item.quantity, 0)
  const finalText= `
Una vez que hayas realizado el pago, debes ingrear a 'Mi cuenta' y marcar la orden como pagada.
Aquí abajo tienes el boton para hacerlo:
`
  const bankData= store.bankData
  const storeOrderNumber= `Asunto: Orden ${order.store.prefix}#${completeWithZeros(order.storeOrderNumber)}`

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from,
    to: testEmailTo ? testEmailTo : order.email.trim(),
    reply_to,
    bcc: process.env.NODE_ENV === "production" ? process.env.SUPPORT_EMAIL : "",
    subject,
    react: BankDataEmail({ 
      storeName: store.name, 
      storeImage: store.image || "",
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
      bankData,
      storeOrderNumber
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

  const subject = "Pago recibido, orden: " + store.prefix + "#" + completeWithZeros(order.storeOrderNumber)
  const totalPrice= order.orderItems.reduce((acc, item) => acc + item.soldUnitPrice * item.quantity, 0)

  const orderNumber= `${store.prefix}#${completeWithZeros(order.storeOrderNumber)}`

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from,
    to: testEmailTo ? testEmailTo : to,
    bcc: process.env.NODE_ENV === "production" ? process.env.SUPPORT_EMAIL : "",
    reply_to,
    subject,
    react: NotifyPaymentEmail({ 
      store: store,
      buyerName: order.name,
      buyerEmail: order.email,
      paymentAmount: totalPrice,
      paymentMethod: order.paymentMethod,
      orderNumber,
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

export async function sendNotifyTransferSentEmail(orderId: string, testEmailTo?: string) {
  const order = await getFullOrderDAO(orderId)
  const store = order.store
  if (!store || !store.emailFrom || !store.mpRedirectUrl) {
    console.log("Error sending notify transfer sent email, data validation failed. Probably emalFrom is not set.")
    console.log("store: ", store)
    
    throw new Error("Error sending email confirmation")
  }
  let from= process.env.DEFAULT_EMAIL_FROM!
  let reply_to= process.env.SUPPORT_EMAIL!
  from= store.emailFrom ? store.emailFrom : process.env.DEFAULT_EMAIL_FROM!
  reply_to= store.contactEmail ? store.contactEmail : process.env.SUPPORT_EMAIL!
  let to= store.contactEmail ? store.contactEmail : process.env.SUPPORT_EMAIL!

  const subject = "Transferencia enviada, orden: " + store.prefix + "#" + completeWithZeros(order.storeOrderNumber)
  const totalPrice= order.orderItems.reduce((acc, item) => acc + item.soldUnitPrice * item.quantity, 0)

  const orderNumber= `${store.prefix}#${completeWithZeros(order.storeOrderNumber)}`

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from,
    to: testEmailTo ? testEmailTo : to,
    bcc: process.env.NODE_ENV === "production" ? process.env.SUPPORT_EMAIL : "",
    reply_to,
    subject,
    react: NotifyTransferEmail({ 
      store: store,
      buyerName: order.name,
      buyerEmail: order.email,
      paymentAmount: totalPrice,
      paymentMethod: order.paymentMethod,
      orderNumber,
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