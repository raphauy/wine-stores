"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { GeneralConfigFormValues, generalConfigSchema } from "@/services/store-services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { getStoreDAOAction, updateConfigsAction } from "./store-actions"
import { toast } from "@/components/ui/use-toast"
import Tiptap from "./tiptap"

type Props= {
  id: string
}

export function GeneralConfigForm({ id }: Props) {
  const form = useForm<GeneralConfigFormValues>({
    resolver: zodResolver(generalConfigSchema),
    defaultValues: {
      name: "",
      image: "",
      description: "",
      contactEmail: "",
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)
  const router= useRouter()

  const onSubmit = async (data: GeneralConfigFormValues) => {

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
          form.setValue("name", data.name)
          form.setValue("image", data.image)
          form.setValue("description", data.description)
          form.setValue("contactEmail", data.contactEmail)
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black dark:text-white font-bold">Nombre:</FormLabel>
                <FormControl>
                  <Input placeholder="Store's name" {...field} />
                </FormControl>
                <FormDescription>Este nombre aparecerá en la portada de la tienda</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="pt-10">
                <FormLabel className="text-black dark:text-white font-bold">Descripción:</FormLabel>
                <FormControl>
                  <Tiptap value={field.value || ""} fieldName="description" />
                </FormControl>
                <FormDescription>Esta descripción aparecerá en la portada de la tienda</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem className="pt-10">
                <FormLabel className="text-black dark:text-white font-bold">Email de contacto:</FormLabel>
                <FormControl>
                  <Input placeholder="Contacto <contacto@tutienda.com>" {...field} />
                </FormControl>
                <FormDescription>
                  Este email aparecerá al final de la portada de la tienda para contacto y es donde recibirás las notificaciones de pagos de tus compradores.
                  También será el mail al que tus clientes podrán responder.
                </FormDescription>
                <FormDescription>
                  Formato: Soporte &lt;soporte@tutienda.com&gt;
                </FormDescription>
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

