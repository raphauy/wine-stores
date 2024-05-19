import { EmailConfigForm } from '@/app/admin/stores/email-config-form'
import { GeneralConfigForm } from '@/app/admin/stores/general-config-form'
import { TestConfirmatioinEmailDialog } from '@/app/admin/stores/test-email'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getStoreDAOBySlug } from '@/services/store-services'
import React from 'react'

type Props= {
  params: {
    storeSlug: string
  }
}
export default async function ConfigPage({ params }: Props) {

    const store= await getStoreDAOBySlug(params.storeSlug)
    if (!store)
        return <div>Store not found</div>
    
    return (
        <div className="w-full flex flex-col gap-4 items-center pt-7 mx-auto text-muted-foreground">
            <h1 className="text-3xl font-bold">Configuración</h1>

            <Tabs defaultValue="general" className="min-w-[500px] max-w-4xl w-full">
                <TabsList className="flex justify-between w-full h-12 mb-8">
                    <div>
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="email-confirmacion">Confirmación de compra</TabsTrigger>
                    </div>
                </TabsList>
                <TabsContent value="general">
                    <div className=" bg-white p-3 py-4 border rounded-md dark:text-white dark:bg-gray-800">
                        <GeneralConfigForm id={store.id} />
                    </div>
                </TabsContent>
                <TabsContent value="email-confirmacion">
                    <div className=" bg-white mb-4 p-3 py-4 border rounded-md dark:text-white dark:bg-gray-800">
                        <EmailConfigForm id={store.id} />
                    </div>
                    <TestConfirmatioinEmailDialog storeId={store.id} type="confirmation" />
                </TabsContent>
            </Tabs>


        </div>
    )
}