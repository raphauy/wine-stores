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
import { getStoreDAOAction, updateConfigsAction } from "./store-actions"
import { toast } from "@/components/ui/use-toast"
import Tiptap from "./tiptap"
import { TestEmailDialog } from "./test-email"

type Props= {
  id: string
}

export function EmailConfigForm({ id }: Props) {
  const form = useForm<EmailConfigFormValues>({
    resolver: zodResolver(emailConfigSchema),
    defaultValues: {
      emailFrom: "",
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
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null) {
            form.setValue(key, "")
          }
        })
      })
    }
  }, [form, id])

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
                <FormDescription>Los emails enviados a tus cliente se enviarán desde esta casilla.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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

