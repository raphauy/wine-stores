import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { OauthFormValues, createOauth, createVerifierAndChallenge, getOauthDAOByStoreId, refreshMercadopagoAccessToken } from '@/services/oauth-services';
import { getStoreDAOBySlug } from "@/services/store-services";
import { UserRole } from "@prisma/client";
import { format } from 'date-fns';
import { revalidatePath } from "next/cache";
import Link from "next/link";

type Props= {
    params: {
        storeSlug: string
    }
}
export default async function MercadoPagoPage({ params }: Props) {

    const session = await auth();
    const currentRole: UserRole| undefined = session?.user?.role as UserRole | undefined
    const isAdmin= currentRole === UserRole.ADMIN || currentRole === UserRole.STORE_OWNER || currentRole === UserRole.STORE_ADMIN
    if (!isAdmin) {
        // private url
        console.log("someone is trying to access a page that is not admin")    
        return <div className="mt-10 text-lg">You are not authorized to access this page</div>
      }
      
    const storeSlug= params.storeSlug

    const store= await getStoreDAOBySlug(storeSlug)

    if (!store)
        return <div>Store not found</div>
    const storeRedirectUrl= store.mpRedirectUrl

    const appId= process.env.MERCADOPAGO_APP_ID
	let redirectUrl = `${storeRedirectUrl}/oauth/mp-callback`

    let oauth= await getOauthDAOByStoreId(store.id, "MercadoPago")

    async function refreshToken() {
        "use server"
        console.log("refreshing token, slug", storeSlug)
        const refreshed= await refreshMercadopagoAccessToken(storeSlug)
        console.log("refreshed", refreshed)
        revalidatePath(`/[storeSlug]/oauth/mercadopago`, "page")
    }
        
    
    if (oauth && oauth.expiresAt) {
        console.log("ya existe oauth verificado")

        return (
            <div className='mt-10 space-y-5 flex flex-col items-center'>
                <p className='font-bold text-xl'>Autorización de MercadoPago</p>
                <div>
                    <p>Expira: {oauth.expiresAt ? format(oauth.expiresAt, 'yyyy-MM-dd HH:mm:ss') : '-'}</p>
                    <p>Quedan: {oauth.expiresAt ? Math.round((oauth.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : -1} días</p>
                </div>
                <form action={refreshToken}>
                    <Button className='mt-10'>Refresh token</Button>
                </form>
                <p>URL: {storeRedirectUrl}</p>
            </div>
        )
    } else {
        const codeChallengeMethod= process.env.MERCADOPAGO_CODE_CHALLENGE_METHOD!
        let authUrl

        if (!oauth) {
            console.log("creando oauth")

            const { codeVerifier, codeChallenge } = await createVerifierAndChallenge(codeChallengeMethod)
    
            const oauthForm: OauthFormValues = {
                provider: "MercadoPago",
                codeVerifier,
                codeChallenge,
                codeChallengeMethod,
                storeId: store.id,
            }
            await createOauth(oauthForm)    
            authUrl= `https://auth.mercadopago.com/authorization?response_type=code&client_id=${appId}&redirect_uri=${redirectUrl}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`
        } else {
            console.log("ya existe oauth sin verificar")
            authUrl= `https://auth.mercadopago.com/authorization?response_type=code&client_id=${appId}&redirect_uri=${redirectUrl}&code_challenge=${oauth.codeChallenge}&code_challenge_method=${oauth.codeChallengeMethod}`
        }


        return (
            <div className='mt-10 space-y-5 flex flex-col items-center'>
                <p className='font-bold text-xl'>Autorización de MercadoPago</p>
                <Link href={authUrl}>
                    <Button>Autorizar en MercadoPago</Button>                
                </Link>

                <p>URL: {storeRedirectUrl}</p>
            </div>
        )    
    }

}

