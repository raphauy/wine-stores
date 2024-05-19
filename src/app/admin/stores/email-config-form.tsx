"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { EmailConfigFormValues, emailConfigSchema } from "@/services/store-services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { getStoreDAOAction, sendConfirmationTestEmailAction, updateConfigsAction } from "./store-actions"
import { toast } from "@/components/ui/use-toast"
import Tiptap from "./tiptap"
import { TestConfirmatioinEmailDialog } from "./test-email"

type Props= {
  id: string
}

export function EmailConfigForm({ id }: Props) {
  const form = useForm<EmailConfigFormValues>({
    resolver: zodResolver(emailConfigSchema),
    defaultValues: {
      emailFrom: "",
      emailConfirmationHtml: "",
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)
  const router= useRouter()

  const onSubmit = async (data: EmailConfigFormValues) => {

    setLoading(true)
    try {
      await updateConfigsAction(id, data)
      toast({ title: "Store actualizado" })
    } catch (error: any) {
      toast({ title: "Error", description: error.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getStoreDAOAction(id).then((data) => {
        if (data) {
          form.setValue("emailFrom", data.emailFrom)
          form.setValue("emailConfirmationHtml", data.emailConfirmationHtml)
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null) {
            form.setValue(key, "")
          }
        })
      })
    }
  }, [form, id])

  async function handleTestEmail() {
    setLoading(true)
    try {
      await sendConfirmationTestEmailAction(id, "test@test.com")
      toast({ title: "Email enviado" })
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="emailFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email From:</FormLabel>
                <FormControl>
                  <Input placeholder="Tienda <tienda@mibodega.com>" {...field} />
                </FormControl>
                <FormDescription>Se enviará el email de confirmación de compra desde esta casilla.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emailConfirmationHtml"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenido:</FormLabel>
                <FormControl>
                  <Tiptap value={field.value || ""} fieldName={field.name} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <p>Variables que puedes utilizar:</p>
          <div className="flex items-center gap-2">
            <p className='font-bold'>LINK_MI_CUENTA:</p>
            <p>Este texto insertará en el contenido del mail el link a la cuenta del usuario.</p>
          </div>


          <div className="flex justify-end">
            <Button onClick={() => router.back()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Guardar</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}

