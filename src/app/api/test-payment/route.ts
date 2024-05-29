import type { NextRequest } from "next/server";

import { processOrderConfirmation, setOrderMercadoPagoNotApproved } from "@/services/core-logic";
import { setOrderStatus } from "@/services/order-services";
import { OrderStatus } from "@prisma/client";
import { MercadoPagoConfig, Payment } from "mercadopago";

const mercadopago = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN!});

export async function POST(request: NextRequest) {
  console.log("TEST ENDPOINT")

  const body = await request.json().then((data) => data as {data: {id: string}, user_id: string})
  console.log("body", body)

  const id = body.data.id
  if (!id) {
	  return Response.json({success: false, message: "id is required"});
  }

  try {
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

    if (paymentStatus === "approved") {
      const updated= await processOrderConfirmation(orderId)

      if (!updated) {
        return Response.json({success: false});
      }
      
      return Response.json({success: true });
    } else {
      await setOrderMercadoPagoNotApproved(orderId)
      return Response.json({success: false});
    }
    
  } catch (error) {
    console.log(error)
    return Response.json({success: false});
  }
}

export async function GET(request: NextRequest) {
  return Response.json({success: true, message: "payment endpoint is working"});
}