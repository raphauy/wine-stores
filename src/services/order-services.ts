import { prisma } from "@/lib/db"
import { Order, OrderStatus, PaymentMethod } from "@prisma/client"
import * as z from "zod"
import { OrderItemDAO } from "./orderitem-services"
import { StoreDAO } from "./store-services"
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { redirect } from "next/navigation"
import { getOauthDAOByStoreId } from "./oauth-services"

export type OrderDAO = {
	id: string
  paymentMethod: PaymentMethod
	status: OrderStatus
  email: string
	phone: string
	address: string
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
	phone: z.string().min(1, "necesitamos un teléfono para asociar este pedido."),
	address: z.string().min(1, "necesitamos una dirección para poder enviar tu pedido."),
})

export type OrderFormValues = z.infer<typeof orderSchema>


export const datosEnvioSchema = z.object({
  email: z.string().email("necesitamos un email para asociar este pedido."),
	phone: z.string().min(1, "necesitamos un teléfono para asociar este pedido."),
	address: z.string().min(1, "necesitamos una dirección para poder enviar tu pedido."),
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
    data
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
      await processOrderTransferenciaBancaria(found)
      break
    case PaymentMethod.RedesDeCobranza:
      await processOrderRedesDeCobranza(found)
      break

    default:
      return "no soportado"
  }
}


//const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });



async function processOrderMercadoPago(order: OrderDAO) {
  
  const oauth= await getOauthDAOByStoreId(order.storeId, "MercadoPago")
  console.log("oauth", oauth)
  
  if (!oauth || !oauth.accessToken)
      throw new Error(`Mercadopago Oauth not found or accessToken not found for store: ${order.store.name}`)

  const client = new MercadoPagoConfig({ accessToken: oauth.accessToken });

	let redirectUrl = order.store.mpRedirectUrl?.endsWith("/") ? order.store.mpRedirectUrl.slice(0, -1) : order.store.mpRedirectUrl
  redirectUrl += `/checkout/pago-confirmado`

  const preference = new Preference(client);

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
      }
    }
  })

  console.log("collector_id", preferenceResponse.collector_id)

  const updated = await prisma.order.update({
    where: {
      id: order.id
    },
    data: {
      status: OrderStatus.Pending
    }
  })

  return preferenceResponse.sandbox_init_point!
}

async function processOrderTransferenciaBancaria(order: Order) {

	console.log("processOrderTransferenciaBancaria", order)

  // MP_ACCESS_TOKEN

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
  const found = await prisma.order.findMany({
    where: {
      email,
      store: {
        slug: storeSlug
      }
    },
    include: {
			store: true,
      orderItems: true,
		}
  })
  return found as OrderDAO[]
}