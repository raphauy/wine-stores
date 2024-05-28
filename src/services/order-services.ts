import { prisma } from "@/lib/db"
import { Order, OrderStatus, PaymentMethod } from "@prisma/client"
import { MercadoPagoConfig, Preference } from 'mercadopago'
import * as z from "zod"
import { getOauthDAOByStoreId } from "./oauth-services"
import { OrderItemDAO } from "./orderitem-services"
import { StoreDAO, getFullStoreDAO } from "./store-services"
import { sendBankDataEmail, sendNotifyPaymentEmail } from "./email-services"

export type OrderDAO = {
	id: string
  storeOrderNumber: number
  paymentMethod: PaymentMethod
	status: OrderStatus
  email: string
	name: string
	address: string
  city: string
	phone: string
	createdAt: Date
	updatedAt: Date
	store: StoreDAO
	storeId: string
  orderItems: OrderItemDAO[]
}

export const orderSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod),
  storeId: z.string().min(1, "necesitamos un id para asociar este pedido."),
  email: z.string().email("necesitamos un email para asociar este pedido."),
	name: z.string().min(1, "necesitamos el nombre del destinatario para poder enviar tu pedido."),
	address: z.string().min(1, "necesitamos una dirección para poder enviar tu pedido."),
  city: z.string().min(1, "necesitamos una ciudad para poder enviar tu pedido."),
	phone: z.string().min(1, "necesitamos un teléfono para asociar este pedido."),
})

export type OrderFormValues = z.infer<typeof orderSchema>


export const datosEnvioSchema = z.object({
  email: z.string().email("necesitamos un email para asociar a este pedido."),
  name: z.string().min(1, "necesitamos el nombre del destinatario para poder enviar tu pedido."),
	address: z.string().min(1, "necesitamos la dirección del destinatario para poder enviar tu pedido."),
  city: z.string().min(1, "necesitamos la ciudad del destinatario para poder enviar tu pedido."),
	phone: z.string().min(1, "necesitamos un teléfono de contacto."),
})

export type DatosEnvioFormValues = z.infer<typeof datosEnvioSchema>


export async function getOrdersDAO() {
  const found = await prisma.order.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as OrderDAO[]
}

export async function getOrderDAO(id: string) {
  const found = await prisma.order.findUnique({
    where: {
      id
    },
  })
  return found as OrderDAO
}
    
export async function createOrder(data: OrderFormValues) {
  const created = await prisma.order.create({
    data: {
      ...data,
      storeOrderNumber: 0 // será sobreescrito por el trigger de postgres que genera el número de orden
    }
  })  
  
  return created  
}
export async function updateOrder(id: string, data: OrderFormValues) {
  const updated = await prisma.order.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteOrder(id: string) {
  const deleted = await prisma.order.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullOrdersDAO(storeSlug: string) {
  const found = await prisma.order.findMany({
    where: {
      store: {
        slug: storeSlug
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
			store: true,
      orderItems: true,
		}
  })
  return found as OrderDAO[]
}
  
export async function getFullOrderDAO(id: string) {
  const found = await prisma.order.findUnique({
    where: {
      id
    },
    include: {
			store: {
        include: {
          bankData: true
        }
      },
      orderItems: true,
		}
  })
  return found as OrderDAO
}

export async function getLastOrderDAO(storeId: string) {
  const found = await prisma.order.findFirst({
    where: {
      storeId
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
			store: true,
      orderItems: true,
		}
  })
  return found as OrderDAO
}

export async function getLastOrderDAOOfUser(storeId:string, email: string) {
  const found = await prisma.order.findFirst({
    where: {
      storeId,
      email
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
			store: true,
      orderItems: true,
		}
  })
  return found as OrderDAO
}

export async function processOrder(id: string) {
  const found = await prisma.order.findUnique({
    where: {
      id
    },
    include: {
      orderItems: true,
      store: true
		}
  })
  if (!found) {
    throw new Error("No se encontro la orden")
  }

  console.log("processOrder to paymentMethod", found.paymentMethod)
  const paymentMethod= found.paymentMethod
  switch (paymentMethod) {
    case PaymentMethod.MercadoPago:
      return await processOrderMercadoPago(found as OrderDAO)

    case PaymentMethod.TransferenciaBancaria:
      return await processOrderTransferenciaBancaria(found as OrderDAO)

    case PaymentMethod.RedesDeCobranza:
      return await processOrderRedesDeCobranza(found as OrderDAO)

    default:
      return "no soportado"
  }
}


async function processOrderMercadoPago(order: OrderDAO) {

  const mpMarketplaceFeePerc= order.store.mpMarketplaceFee
  const totalOrderValue= order.orderItems.reduce((acc, item) => acc + item.soldUnitPrice * item.quantity, 0)
  const mpFee= Number((totalOrderValue * mpMarketplaceFeePerc / 100).toFixed(2))
  console.log("feePerc:", mpMarketplaceFeePerc, " value:", totalOrderValue, " totalFee:", mpFee)

  const oauth= await getOauthDAOByStoreId(order.storeId, "MercadoPago")
  console.log("oauth", oauth)
  
  if (!oauth || !oauth.accessToken)
      throw new Error(`Mercadopago Oauth not found or accessToken not found for store: ${order.store.name}`)

  const client = new MercadoPagoConfig({ accessToken: oauth.accessToken });

	let redirectUrl = order.store.mpRedirectUrl?.endsWith("/") ? order.store.mpRedirectUrl.slice(0, -1) : order.store.mpRedirectUrl
  redirectUrl += `/checkout/pago-confirmado`

  const preference = new Preference(client)

  const preferenceResponse = await preference.create({
    body: {
      items: order.orderItems.map(item => {
        return {
          id: item.productId,
          title: item.soldName,
          image: item.soldImage,
          quantity: item.quantity,
          unit_price: item.soldUnitPrice
        }
      }),
      external_reference: order.id,
      metadata: {
        order_id: order.id,
      },
      back_urls: {
        success: redirectUrl,
        failure: redirectUrl,
        pending: redirectUrl,
      },
      marketplace: process.env.MP_PUBLIC_KEY,
      marketplace_fee: mpFee,
    }
  })

  console.log("collector_id", preferenceResponse.collector_id)

  await prisma.order.update({
    where: {
      id: order.id
    },
    data: {
      status: OrderStatus.Pending
    }
  })

  const isProduction= process.env.MP_SANDBOX === "false"
  const initPoint= isProduction ? preferenceResponse.init_point! : preferenceResponse.sandbox_init_point!

  return initPoint
}


async function processOrderTransferenciaBancaria(order: Order) {

  const store= await getFullStoreDAO(order.storeId)

  const bankDataUrl= `${store.mpRedirectUrl}/checkout/validar-email?email=${order.email}&storeId=${order.storeId}`


  return bankDataUrl
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

  const updated= await prisma.order.update({
    where: {
      id: order.id
    },
    data: {
      status: OrderStatus.Pending
    }
  })

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
  }

  const updated= await prisma.order.update({
    where: {
      id: order.id
    },
    data: {
      status: OrderStatus.PaymentSent
    }
  })

  await sendNotifyPaymentEmail(order.id)

  return updated
}
async function processOrderRedesDeCobranza(order: Order) {

	console.log("processOrderRedesDeCobranza", order)

}

export async function setOrderStatus(orderId: string, status: OrderStatus) {
  const updated = await prisma.order.update({
    where: {
      id: orderId
    },
    data: {
      status
    }
  })
  return updated
}

export async function getFullOrdersDAOByEmail(email: string, storeSlug: string) {
  console.log(email, storeSlug)
  
  const found = await prisma.order.findMany({
    where: {
      email,
      store: {
        slug: storeSlug
      }
    },
    include: {
			store: {
        include: {
          bankData: true
        }
      },
      orderItems: true,
		},
    orderBy: {
      createdAt: "desc"
    }
  })
  return found as OrderDAO[]
}

