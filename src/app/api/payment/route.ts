import type { NextRequest } from "next/server";

import { setOrderStatus } from "@/services/order-services";
import { OrderStatus } from "@prisma/client";
import { MercadoPagoConfig, Payment } from "mercadopago";

const mercadopago = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN!});

export async function POST(request: NextRequest) {
  
  const body = await request.json().then((data) => data as {data: {id: string}, user_id: string})
  console.log("body", body)

  const id = body.data.id
  if (!id) {
	  return Response.json({success: false, message: "id is required"});
  }

  const secret= request.headers.get("x-signature-id")
  console.log("secret", secret)
//   if (secret !== process.env.MP_PAYMENT_SECRET_KEY) {
// 	return Response.json({success: false});
//   }

  const payment = await new Payment(mercadopago).get({ id })

  const paymentStatus = payment.status
  console.log("paymentStatus", paymentStatus)  

  const data = {
    id: payment.id,
    amount: payment.transaction_amount,
    message: payment.description,
  };

  console.log(data)

  const orderId= payment.metadata.order_id
  const externalReference= payment.external_reference
  console.log("externalReference", externalReference)
  
  
  const updated= await setOrderStatus(orderId, OrderStatus.Paid)
  if (!updated) {
    return Response.json({success: false});
  }

  return Response.json({success: true});
}

export async function GET(request: NextRequest) {
  return Response.json({success: true, message: "payment endpoint is working"});
}