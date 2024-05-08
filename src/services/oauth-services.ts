import * as z from "zod"
import { prisma } from "@/lib/db"
import { StoreDAO } from "./store-services"
import { createHash, randomBytes } from "crypto"

export type OauthDAO = {
	id: string
	provider: string
	codeVerifier: string
	codeChallenge: string
	codeChallengeMethod: string
	accessToken: string | undefined
	refreshToken: string | undefined
	expiresAt: Date | undefined
  userId: string | undefined
	createdAt: Date
	updatedAt: Date
	store: StoreDAO
	storeId: string
}

export const oauthSchema = z.object({
	provider: z.string().min(1, "provider is required."),
	codeVerifier: z.string().min(1, "codeVerifier is required."),
	codeChallenge: z.string().min(1, "codeChallenge is required."),
	codeChallengeMethod: z.string().min(1, "codeChallengeMethod is required."),
	accessToken: z.string().optional(),
	refreshToken: z.string().optional(),
	expiresAt: z.date().optional(),
  userId: z.string().optional(),
	storeId: z.string().min(1, "storeId is required."),
})

export type OauthFormValues = z.infer<typeof oauthSchema>


export async function getOauthsDAO() {
  const found = await prisma.oauth.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as OauthDAO[]
}

export async function getOauthDAO(id: string) {
  const found = await prisma.oauth.findUnique({
    where: {
      id
    },
  })
  return found as OauthDAO
}
    
export async function createOauth(data: OauthFormValues) {
  // TODO: implement createOauth
  const created = await prisma.oauth.create({
    data
  })
  return created
}

export async function updateOauth(id: string, data: OauthFormValues) {
  const updated = await prisma.oauth.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteOauth(id: string) {
  const deleted = await prisma.oauth.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullOauthsDAO() {
  const found = await prisma.oauth.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			store: true,
		}
  })
  return found as OauthDAO[]
}
  
export async function getFullOauthDAO(id: string) {
  const found = await prisma.oauth.findUnique({
    where: {
      id
    },
    include: {
			store: true,
		}
  })
  return found as OauthDAO
}
    

export async function getOauthDAOByStoreId(storeId: string, provider: string) {
  const found = await prisma.oauth.findFirst({
    where: {
      storeId,
      provider,
    },
    orderBy: {
      id: 'asc'
    },
  })
  return found as OauthDAO
}

export async function getOauthDAOByUserId(userId: string, provider: string) {
  const found = await prisma.oauth.findFirst({
    where: {
      userId,
      provider,
    },
    orderBy: {
      id: 'asc'
    },
  })
  return found as OauthDAO
}

export async function getOauthDAOByStoreSlug(storeSlug: string, provider: string) {
  const found = await prisma.oauth.findFirst({
    where: {
      store: {
        slug: storeSlug,
      },
      provider,
    },
    orderBy: {
      id: 'asc'
    },
  })
  return found as OauthDAO
}

export async function setAccessToken(storeSlug: string, provider: string, accessToken: string, refreshToken: string, expiresIn: number, userId: string) {
  const oauth= await getOauthDAOByStoreSlug(storeSlug, provider)
  if (!oauth)
      throw new Error("Oauth not found")

  try {
    const updated= await prisma.oauth.update({
        where: {
            id: oauth.id,
        },
        data: {
            accessToken,
            refreshToken,
            expiresAt: new Date(Date.now() + expiresIn * 1000),
            userId,
        },
    })
    return updated
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getMercadopagoAccessToken(code: string, codeVerifier: string, mpRedirectUrl: string){
  try {
    const bodyParams = {
      client_id: process.env.MERCADOPAGO_APP_ID,
      client_secret: process.env.MERCADOPAGO_APP_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${mpRedirectUrl}/oauth/mp-callback`,
      code_verifier: codeVerifier,
    }

    console.log("bodyParams", bodyParams)    

    const response= await fetch(`https://api.mercadopago.com/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyParams),
    })

    console.log("response", response)
    

    const data = await response.json()
    
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function refreshMercadopagoAccessToken(storeSlug: string){

  const oauth= await getOauthDAOByStoreSlug(storeSlug, "MercadoPago")
  if (!oauth)
      throw new Error("Oauth not found")

  try {
    const bodyParams = {
      client_id: process.env.MERCADOPAGO_APP_ID,
      client_secret: process.env.MERCADOPAGO_APP_SECRET,
      grant_type: "refresh_token",
      refresh_token: oauth.refreshToken,
    }

    console.log("bodyParams", bodyParams)    

    const response= await fetch(`https://api.mercadopago.com/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyParams),
    })

    console.log("response", response)
    

    const data = await response.json()

    // update oauth
    if (data.access_token && data.refresh_token && data.expires_in && data.user_id) {
      await setAccessToken(storeSlug, "MercadoPago", data.access_token, data.refresh_token, data.expires_in, data.user_id + "")
    }
    
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function createVerifierAndChallenge(codeChallengeMethod: string) {

  if (codeChallengeMethod !== "S256" && codeChallengeMethod !== "plain")
    throw new Error("codeChallengeMethod must be S256 or plain")

  const codeVerifier= base64URLEncode(randomBytes(32));
  const codeChallenge= base64URLEncode(sha256(Buffer.from(codeVerifier)));

  return {
    codeVerifier,
    codeChallenge,
  }
}

function base64URLEncode(buffer: Buffer): string {
  return buffer.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
}

function sha256(buffer: Buffer): Buffer {
  return createHash('sha256').update(buffer).digest();
}