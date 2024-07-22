import type { NextRequest } from "next/server";

import { processOrderConfirmation, setOrderMercadoPagoNotApproved } from "@/services/core-logic";
import { setOrderStatus } from "@/services/order-services";
import { OrderStatus } from "@prisma/client";

// body {
//   deliveryId: 'CEhkpBSZsM2AP2DMDYMF9f',
//   webhookId: 'KUMLWTn1CGc1P5YpirHZgZ',
//   originalDeliveryId: '__test__f8e775ce-6694-453d-81c9-c922805a8bd7__test__',
//   isRedelivery: false,
//   type: 'InvoiceCreated',
//   timestamp: 1717375179,
//   storeId: '9Dh64zYSNSRYjWGVrHoTiyJKjTAEztzdi5CsPahqfeqP',
//   invoiceId: '__test__7fbb1825-16eb-48c6-b556-fdf1abd05fac__test__',
//   metadata: null
// }

type InvoiceCreated = {
  deliveryId: string,
  webhookId: string,
  originalDeliveryId: string,
  isRedelivery: boolean,
  type: string,
  timestamp: number,
  storeId: string,
  invoiceId: string,
  metadata: any
}

export async function POST(request: NextRequest) {
  console.log("BTCPAY ENDPOINT")

  const body = await request.json().then((data) => data as InvoiceCreated)
  console.log("body", body)

  const invoiceId = body.invoiceId
  if (!invoiceId) {
	  return Response.json({success: false, message: "id is required"});
  }
  console.log("id", invoiceId)
  const storeId= body.storeId
  console.log("storeId", storeId)

  const orderId= body.metadata.orderId
  console.log("orderId", orderId)

  

  try {

    
    return Response.json({success: true });

  } catch (error) {
    console.log(error)
    return Response.json({success: false});
  }
}

export async function GET(request: NextRequest) {
  return Response.json({success: true, message: "payment endpoint is working"});
}