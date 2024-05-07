import { getMercadopagoAccessToken, getOauthDAOByStoreSlug, setAccessToken } from "@/services/oauth-services"

type Props= {
    params: {
        storeSlug: string
    }
    searchParams: {
        code: string
    }
}

export default async function MPCallbackPage({ params, searchParams }: Props) {

  const code= searchParams.code as string

  console.log("code", code)

  if (!code)
    return <div>Invalid code</div>

  const storeSlug= params.storeSlug
  const oauth= await getOauthDAOByStoreSlug(storeSlug, "MercadoPago")

  const data= await getMercadopagoAccessToken(code, oauth.codeVerifier, storeSlug)

  const accessToken= data.access_token
  const refreshToken= data.refresh_token
  const expiresIn= data.expires_in
  const userId= data.user_id + ""
  console.log("accessToken", accessToken)
  console.log("refreshToken", refreshToken)
  console.log("expiresIn", expiresIn)
  console.log("userId", userId)

  if (!accessToken || !refreshToken || !expiresIn || !userId)
    return <div>Error getting access token</div>
  
  const updated= await setAccessToken(storeSlug, "MercadoPago", accessToken, refreshToken, expiresIn, userId)
  if (!updated)
    return <div>Error setting access token</div>

  return (
    <div>
        <p>MercadoPago Callback</p>
        <p>Code: {code}</p>
        <p>Access Token: {accessToken ? accessToken.slice(0, -4) + "..." : ""}</p>
        <p>Refresh Token: {refreshToken ? accessToken.slice(0, -4) + "..." : ""}</p>
        <p>Expires In: {expiresIn}</p>
    </div>
  )
}
